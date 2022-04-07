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
 * @module rules/embeds/youtube
 */

/**
 * Add support for [YouTube](http://youtube.com/) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[youtube <id>]`. E.g. `[youtube iom_nhYQIYk]`.
 * Height and width can optionally be set using `[youtube <id> [height] [width]]`. E.g. `[youtube iom_nhYQIYk 380 560]`.
 * The default value for height is 270, and for width is 480.
 *
 * @example
 * [youtube iom_nhYQIYk]
 *
 * <iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="380" width="560" frameborder="0" allowfullscreen>
 *     <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
 * </iframe>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for YouTube markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const youtubeRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 11) return false; // [youtube a]
        if (currentLine.slice(0, 9) !== '[youtube ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for youtube match
        const match = currentLine.match(/^\[youtube (\S+?)(?: (\d+))?(?: (\d+))?\]$/);
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
        const token = state.push('youtube', 'youtube', 0);
        token.block = true;
        token.markup = match[0];
        token.youtube = { id, height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'youtube', youtubeRule);

    /**
     * Rendering rule for YouTube markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.youtube = (tokens, index) => {
        const token = tokens[index];

        // Return the HTML
        return `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(token.youtube.id)}" class="youtube" height="${token.youtube.height}" width="${token.youtube.width}" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=${encodeURIComponent(token.youtube.id)}" target="_blank">View YouTube video</a>
</iframe>\n`;
    };
};
