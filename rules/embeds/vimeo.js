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
 * @module rules/embeds/vimeo
 */

const reduceFraction = require('../../util/reduce_fraction');

/**
 * Add support for [Vimeo](http://player.vimeo.com) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[vimeo <url>]`. E.g., `[vimeo https://player.vimeo.com/video/329272793]`.
 * Height and width can optionally be set using `[vimeo <url> [height] [width]]`. E.g., `[vimeo https://player.vimeo.com/video/329272793 380 560]`.
 * The default value for height is 270 and for width is 480.
 *
 * @example
 * [vimeo https://player.vimeo.com/video/329272793]
 *
 * <iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
 *     <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
 * </iframe>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Vimeo markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const vimeoRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 9) return false; // [vimeo a]
        if (currentLine.slice(0, 7) !== '[vimeo ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for vimeo match
        const match = currentLine.match(/^\[vimeo (?:(?:(?:https?:)?\/\/)?player\.vimeo\.com\/video\/)?(\d+)?(?: (\d+))?(?: (\d+))?]$/);
        if (!match) return false;

        // Get the id from the url
        const id = match[1];
        if (!id) return false;

        // Get the height
        const height = Number(match[2]) || 270;

        // Get the width
        const width = Number(match[3]) || 480;

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('vimeo', 'vimeo', 0);
        token.block = true;
        token.markup = match[0];
        token.vimeo = { id: Number(id), height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'vimeo', vimeoRule);

    /**
     * Rendering rule for Vimeo markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.vimeo = (tokens, index) => {
        const token = tokens[index];

        // Determine the aspect ratio
        const aspectRatio = reduceFraction(token.vimeo.width, token.vimeo.height).join('/');

        // Return the HTML
        return `<iframe src="https://player.vimeo.com/video/${encodeURIComponent(token.vimeo.id)}" class="vimeo" height="${token.vimeo.height}" width="${token.vimeo.width}" style="aspect-ratio: ${aspectRatio}" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/${encodeURIComponent(token.vimeo.id)}" target="_blank">View Vimeo video</a>
</iframe>\n`;
    };
};
