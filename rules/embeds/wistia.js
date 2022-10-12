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
 * @module rules/embeds/wistia
 */

/**
 * Add support for [Wistia](https://fast.wistia.net) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[wistia <id>]`. E.g., `[wistia 7ld71zbvi6]`.
 * Height and width can optionally be set using `[wistia <id> [height] [width]]`. E.g., `[wistia 7ld71zbvi6 380 560]`.
 * The default value for height is 270 and for width is 480.
 *
 * @example
 * [wistia 7ld71zbvi6]
 *
 * <iframe src="https://fast.wistia.net/embed/iframe/7ld71zbvi6" class="wistia" height="270" width="480" frameborder="0" allowfullscreen>
 *     <a href="https://fast.wistia.net/embed/iframe/7ld71zbvi6" target="_blank">View Wistia video</a>
 * </iframe>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Wistia markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const wistiaRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 10) return false; // [wistia a]
        if (currentLine.slice(0, 8) !== '[wistia ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for wistia match
        const match = currentLine.match(/^\[wistia (\S+?)(?: (\d+))?(?: (\d+))?\]$/);
        if (!match) return false;

        // Get the id
        const id = match[1];
        if (!id) return false;

        // Get the height
        const height = Number(match[2]) || 270;

        // Get the width
        const width = Number(match[3]) || 480;

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('wistia', 'wistia', 0);
        token.block = true;
        token.markup = match[0];
        token.wistia = { id, height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'wistia', wistiaRule);

    /**
     * Rendering rule for Wistia markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.wistia = (tokens, index) => {
        const token = tokens[index];

        // Return the HTML
        return `<iframe src="https://fast.wistia.net/embed/iframe/${encodeURIComponent(token.wistia.id)}" class="wistia" height="${token.wistia.height}" width="${token.wistia.width}" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/${encodeURIComponent(token.wistia.id)}" target="_blank">View Wistia video</a>
</iframe>\n`;
    };
};
