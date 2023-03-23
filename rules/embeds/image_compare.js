/*
Copyright 2022 DigitalOcean

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
 * @module rules/embeds/image_compare
 */

/**
 * Add support for Image Comparison in Markdown, as block syntax.
 *
 * The basic syntax is `[image_compare <url1> <url2>]`. E.g., `[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg]`.
 * Height and width can optionally be set using `[vimeo <url1> <url2> [height] [width]]`. E.g., `[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg 500 560]`.
 * The default value for height is 500 and for width is 500.
 *
 * @example
 * [image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg]
 *
 * <div class="imageCompare" style="--value:50%; height: 500px; width: 500px;">
 *     <img class="image-left" src="https://rb.gy/jykhuo" alt="Image left"/>
 *     <img class="image-right" src="https://rb.gy/zt5afg" alt="Image right"/>
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
    const imageCompareRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 19) return false; // [image_compare a b]
        if (currentLine.slice(0, 15) !== '[image_compare ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for vimeo match
        const match = currentLine.match(/^\[image_compare (\S+) (\S+)(?: (\d+))?(?: (\d+))?]$/);
        if (!match) return false;

        // Get the first image
        const imageLeft = match[1];
        if (!imageLeft) return false;

        // Get the second image
        const imageRight = match[2];
        if (!imageRight) return false;

        // Get the height
        const height = Number(match[3]) || 500;

        // Get the width
        const width = Number(match[4]) || 500;

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('image_compare', 'image_compare', 0);
        token.block = true;
        token.markup = match[0];
        token.image_compare = { imageLeft, imageRight, height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'image_compare', imageCompareRule);

    /**
     * Rendering rule for image_compare markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.image_compare = (tokens, index) => {
        const token = tokens[index];

        // Return the HTML
        return `<div class="imageCompare" style="--value:50%; height: ${token.image_compare.height}px; width: ${token.image_compare.width}px;">
    <img class="image-left" src="${token.image_compare.imageLeft}" alt="Image left"/>
    <img class="image-right" src="${token.image_compare.imageRight}" alt="Image right"/>
    <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', \`\${this.value}%\`)" />
    <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
</div>\n`;
    };
};
