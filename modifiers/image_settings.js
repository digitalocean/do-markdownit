/*
Copyright 2023 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/**
 * @module modifiers/image_settings
 */

const safeObject = require('../util/safe_object');
const regexEscape = require('../util/regex_escape');

/**
 * @typedef {Object} ImageSettingsOptions
 * @property {string[]} [sizeUnits=['', 'px', '%']] Image size units to allow.
 */

/**
 * Add support for defining settings on images, such as size and alignment.
 *
 * The syntax for this is `{ width=<width> height=<height> align=<alignment> }`, at the end of the image.
 * E.g. `![alt](test.png "title"){ width=100 height=200 align=left }`.
 * All settings are optional, and the order does not matter.
 *
 * By default, the width and height can be plain number (`100`), pixels (`100px`), or percentage (`100%`).
 * Other units can be supported by passing an array of unit strings via the `sizeUnits` option.
 *
 * Alignment can be left unset, or can be either `left` or `right`.
 *
 * @example
 * ![alt](test.png "title"){ width=100 height=200 align=left }
 *
 * <p><img src="test.png" alt="alt" title="title" width="100" height="200" align="left"></p>
 *
 * @type {import('markdown-it').PluginWithOptions<ImageSettingsOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    // Get the units to allow
    const units = Array.isArray(optsObj.sizeUnits) && optsObj.sizeUnits.length ? optsObj.sizeUnits : [ '', 'px', '%' ];
    const nonEmptyUnits = units.filter(unit => unit !== '');
    const unitPattern = `^\\d+${nonEmptyUnits.length ? `(?:${nonEmptyUnits.map(regexEscape).join('|')})${units.includes('') ? '?' : ''}` : ''}$`;

    /**
     * Wrap the link parsing rule to allow for parsing settings syntax after the image.
     *
     * @param {import('markdown-it/lib/parser_inline').RuleInline} original Original parse function (`image`).
     * @returns {import('markdown-it/lib/parser_inline').RuleInline}
     * @private
     */
    const imageWithSettings = original => (state, silent) => {
        // Run the original image rule
        const originalResult = original(state, silent);
        if (!originalResult) return originalResult;

        // If the image rule succeeded, start looking for our extra settings syntax
        // If at any point we fail, we just return the original result as to not break regular images

        // Check we have space for opening and closing tags
        if (state.pos + 2 > state.posMax) return originalResult;

        // Check we're on an opening marker
        if (state.src[state.pos] !== '{') return originalResult;

        // Look for closing marker
        const closeIdx = state.src.indexOf('}', state.pos + 1);
        if (closeIdx === -1 || closeIdx > state.posMax - 1) return originalResult;

        // Get the settings string
        const parts = state.src.slice(state.pos + 1, closeIdx).trim().split(/\s+/);
        const settings = {};
        for (const part of parts) {
            // Check the setting has a key and value
            const split = part.indexOf('=');
            if (split === -1 || split === 0 || split === part.length - 1) return originalResult;

            // Check this is a valid setting
            const key = part.slice(0, split);
            const value = part.slice(split + 1);
            switch (key) {
                // If we have a size, check it's using a permitted unit
                case 'width':
                case 'height':
                    if (!value.match(unitPattern)) return originalResult;
                    break;

                // If we have an alignment, check it's a valid value
                case 'align':
                    if (![ 'left', 'right' ].includes(value)) return originalResult;
                    break;

                // We're not expecting any other settings
                default:
                    return originalResult;
            }

            // Store the setting
            settings[key] = value;
        }

        // Apply the settings to the token
        const imageToken = state.tokens[state.tokens.length - 1];
        if (settings.width) imageToken.attrSet('width', settings.width);
        if (settings.height) imageToken.attrSet('height', settings.height);
        if (settings.align) imageToken.attrSet('align', settings.align);

        // Update the position
        state.pos = closeIdx + 1;

        // Return the original result
        return originalResult;
    };

    // eslint-disable-next-line no-underscore-dangle
    md.inline.ruler.at('image', imageWithSettings(md.inline.ruler.__rules__.find(rule => rule.name === 'image').fn));
};
