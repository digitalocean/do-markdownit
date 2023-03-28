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
 * @module rules/embeds/compare
 */

/**
 * Add support for Image Comparison in Markdown, as block syntax.
 *
 * The basic syntax is `[compare <url1> <url2>]`. E.g., `[compare https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png]`.
 * Height and width can optionally be set using `[compare <url1> <url2> [height] [width]]`. E.g., `[compare https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png 500 560]`.
 * The default value for height is 270 and for width is 480.
 *
 * @example
 * [compare https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png]
 *
 * <div class="image-compare" style="--value:50%; height: 270px; width: 480px;">
 *     <img class="image-left" src="https://assets.digitalocean.com/banners/python.png" alt="Image left"/>
 *     <img class="image-right" src="https://assets.digitalocean.com/banners/javascript.png" alt="Image right"/>
 *     <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', `${this.value}%`)" />
 *     <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
 * </div>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Image compare markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const compareRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 13) return false; // [compare a b]
        if (currentLine.slice(0, 9) !== '[compare ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for compare match
        const match = currentLine.match(/^\[compare (\S+) (\S+)(?: (\d+))?(?: (\d+))?]$/);
        if (!match) return false;

        // Get the first image
        const imageLeft = match[1];
        if (!imageLeft) return false;

        // Get the second image
        const imageRight = match[2];
        if (!imageRight) return false;

        // Get the height
        const height = Number(match[3]) || 270;

        // Get the width
        const width = Number(match[4]) || 480;

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('compare', 'compare', 0);
        token.block = true;
        token.markup = match[0];
        token.compare = { imageLeft, imageRight, height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'compare', compareRule);

    /**
     * Rendering rule for compare markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.compare = (tokens, index) => {
        const token = tokens[index];

        // Return the HTML
        return `<div class="image-compare" style="--value:50%; height: ${md.utils.escapeHtml(token.compare.height)}px; width: ${md.utils.escapeHtml(token.compare.width)}px;">
    <img class="image-left" src="${md.utils.escapeHtml(token.compare.imageLeft)}" alt="Image left"/>
    <img class="image-right" src="${md.utils.escapeHtml(token.compare.imageRight)}" alt="Image right"/>
    <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', \`\${this.value}%\`)" />
    <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
</div>\n`;
    };
};
