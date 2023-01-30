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

/**
 * Add support for setting sizes on images.
 *
 * The syntax for this is `=[width]x[height]`, at the end of the image. E.g. `![alt](test.png "title" =100x200)`.
 * Either the width or height can be set, or both. E.g. `![alt](test.png "title" =100x)` or `![alt](test.png "title" =x200)`.
 * The width and height can be plain number (`100`), or pixels (`100px`), or percentage (`100%`).
 *
 * @example
 * ![alt](test.png "title" =100x200)
 *
 * <p><img src="test.png" alt="alt" title="title" width="100" height="200"></p>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * @typedef {Object} ParsedLinkTitle
     * @private
     * @property {boolean} ok Whether the title was parsed successfully.
     * @property {number} pos Position to continue parsing from.
     * @property {number} lines Number of line breaks in the title.
     * @property {string} str Parsed title.
     */

    /**
     * @typedef {function} ParseLinkTitle
     * @private
     * @param {string} str String to parse.
     * @param {number} pos Position to start parsing at.
     * @param {number} max Maximum position to parse to.
     * @return {ParsedLinkTitle}
     */

    /**
     * Wrap the link title parsing helper to allow for parsing size syntax after the title.
     *
     * @param {ParseLinkTitle} original Original parse function (`parseLinkTitle`).
     * @param {Object} extra Mutable object to store extra size information.
     * @return {ParseLinkTitle}
     * @private
     */
    const parseLinkTitleAndSize = (original, extra) => (str, start, max) => {
        // Run the title parser
        const result = original(str, start, max);

        // Skip any spaces immediately after the title
        let pos = result.ok ? result.pos : start;
        for (; pos < max; pos++) {
            const code = str.charCodeAt(pos);
            if (!md.utils.isSpace(code) && code !== 0x0A) break;
        }

        // If the next character is a `=`, then we might have a size
        if (pos < max && str[pos] === '=') {
            // See if we can parse a size
            const remaining = str.slice(pos, max);
            const match = remaining.match(/^=(\d+(?:px|%)?)?x(\d+(?:px|%)?)?/);

            // If we don't have a match, then we're in a bad state, return a not-ok result
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
     * @return {import('markdown-it/lib/parser_inline').RuleInline}
     * @private
     */
    const imageWithSize = original => (state, silent) => {
        // Create a mutable object to track extras (the size)
        const extra = {};

        // Modify how this rule parses link titles, so we can extra the size too
        const proxiedHelpers = new Proxy(state.md.helpers, {
            get: (target, prop) => {
                if (prop === 'parseLinkTitle') return parseLinkTitleAndSize(target[prop], extra);
                return target[prop];
            },
        });
        const proxiedMd = new Proxy(state.md, {
            get: (target, prop) => {
                if (prop === 'helpers') return proxiedHelpers;
                return target[prop];
            },
        });
        const proxiedState = new Proxy(state, {
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

    md.inline.ruler.at('image', imageWithSize(md.inline.ruler.__rules__.find(rule => rule.name === 'image').fn));
};
