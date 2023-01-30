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
 * @module modifiers/image_size
 */

const safeObject = require('../util/safe_object');
const regexEscape = require('../util/regex_escape');

/**
 * @typedef {Object} ImageSizeOptions
 * @property {string[]} [units=['', 'px', '%']] Image size units to allow.
 */

/**
 * Add support for setting sizes on images.
 *
 * The syntax for this is `=[width]x[height]`, at the end of the image. E.g. `![alt](test.png "title" =100x200)`.
 * Either the width or height can be set, or both. E.g. `![alt](test.png "title" =100x)` or `![alt](test.png "title" =x200)`.
 *
 * By default, the width and height can be plain number (`100`), or pixels (`100px`), or percentage (`100%`).
 * Other units can be supported by passing an array of unit strings via the `units` option.
 *
 * @example
 * ![alt](test.png "title" =100x200)
 *
 * <p><img src="test.png" alt="alt" title="title" width="100" height="200"></p>
 *
 * @type {import('markdown-it').PluginWithOptions<ImageSizeOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);
    const units = Array.isArray(optsObj.units) && optsObj.units.length ? optsObj.units : [ '', 'px', '%' ];
    const nonEmptyUnits = units.filter(unit => unit !== '');
    const unitPattern = `\\d+${nonEmptyUnits.length ? `(?:${nonEmptyUnits.map(regexEscape).join('|')})${units.includes('') ? '?' : ''}` : ''}`;
    const pattern = `^=(${unitPattern})?x(${unitPattern})?`;

    /**
     * @typedef {Object} ParsedLinkTitle
     * @private
     * @property {boolean} ok Whether the title was parsed successfully.
     * @property {number} pos Position to continue parsing from.
     * @property {number} lines Number of line breaks in the title.
     * @property {string} str Parsed title.
     */

    /**
     * @typedef {Function} ParseLinkTitle
     * @private
     * @param {string} str String to parse.
     * @param {number} pos Position to start parsing at.
     * @param {number} max Maximum position to parse to.
     * @returns {ParsedLinkTitle}
     */

    /**
     * Wrap the link title parsing helper to allow for parsing size syntax after the title.
     *
     * @param {ParseLinkTitle} original Original parse function (`parseLinkTitle`).
     * @param {Object} extra Mutable object to store extra size information.
     * @returns {ParseLinkTitle}
     * @private
     */
    const parseLinkTitleAndSize = (original, extra) => (str, start, max) => {
        // Run the title parser
        const result = original(str, start, max);

        // Skip any spaces immediately after the title
        let pos = result.ok ? result.pos : start;
        for (; pos < max; pos += 1) {
            const code = str.charCodeAt(pos);
            if (!md.utils.isSpace(code) && code !== 0x0A) break;
        }

        // If the next character is a `=`, then we might have a size
        if (pos < max && str[pos] === '=') {
            // See if we can parse a size, otherwise return a non-ok result
            const match = str.slice(pos, max).match(pattern);
            if (!match) return { ok: false, pos: 0, lines: 0, str: '' };

            // Store the size in the extra object
            extra.size = { width: match[1], height: match[2] };

            // Jump the result position to the end of the size
            result.ok = true;
            result.pos = pos + match[0].length;
        }

        return result;
    };

    /**
     * Wrap the link parsing rule to allow for parsing size syntax after the title.
     *
     * @param {import('markdown-it/lib/parser_inline').RuleInline} original Original parse function (`image`).
     * @returns {import('markdown-it/lib/parser_inline').RuleInline}
     * @private
     */
    const imageWithSize = original => (state, silent) => {
        // Create a mutable object to track extras (the size)
        const extra = {};

        // Modify how this rule parses link titles, so we can extra the size too
        const proxiedHelpers = new Proxy(state.md.helpers, {
            /**
             * Get the property from the original helpers object, unless `parseLinkTitle`, then use our wrapper.
             *
             * @template T
             * @param {Object} target Target object (the original helpers object).
             * @param {string} prop Property name.
             * @returns {T}
             * @private
             */
            get: (target, prop) => {
                if (prop === 'parseLinkTitle') return parseLinkTitleAndSize(target[prop], extra);
                return target[prop];
            },
        });
        const proxiedMd = new Proxy(state.md, {
            /**
             * Get the property from the original MD object, unless `helpers`, then use our proxy.
             *
             * @template T
             * @param {Object} target Target object (the original MD object).
             * @param {string} prop Property name.
             * @returns {T}
             * @private
             */
            get: (target, prop) => {
                if (prop === 'helpers') return proxiedHelpers;
                return target[prop];
            },
        });
        const proxiedState = new Proxy(state, {
            /**
             * Get the property from the original state object, unless `md`, then use our proxy.
             *
             * @template T
             * @param {Object} target Target object (the original state object).
             * @param {string} prop Property name.
             * @returns {T}
             * @private
             */
            get: (target, prop) => {
                if (prop === 'md') return proxiedMd;
                return target[prop];
            },
        });

        // Run the original image rule
        const originalResult = original(proxiedState, silent);

        // If the image rule succeeded, and we have a size, add it to the token
        if (!silent && originalResult && extra.size) {
            const imageToken = state.tokens[state.tokens.length - 1];
            if (extra.size.width) imageToken.attrSet('width', extra.size.width);
            if (extra.size.height) imageToken.attrSet('height', extra.size.height);
        }

        // Return the original result
        return originalResult;
    };

    // eslint-disable-next-line no-underscore-dangle
    md.inline.ruler.at('image', imageWithSize(md.inline.ruler.__rules__.find(rule => rule.name === 'image').fn));
};
