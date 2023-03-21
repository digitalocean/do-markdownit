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
 * @module rules/embeds/instagram
 */

const safeObject = require('../../util/safe_object');

/**
 * Add support for [Instagram](https://instagram.com/) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[instagram <post>]`. E.g. `[instagram https://www.instagram.com/p/CkQuv3_LRgS]`.
 * After the post, assorted space-separated flags can be added (in any combination/order):
 *
 * - Add `caption` to include caption under the post.
 * - Add `left`, `center`, or `right` to set the alignment of the embed (default is `left`).
 * - Add any set of digits to set the width of the embed (in pixels, between 326 and 550, default is 540).
 *
 * If two or more alignments are selected, `left` will be preferred, followed by `center`, then `right`.
 *
 * If a width outside the range of 326-550 is selected, a clamped value will be used.
 *
 * @example
 * [instagram https://www.instagram.com/p/CkQuv3_LRgS]
 *
 * [instagram https://www.instagram.com/p/CkQuv3_LRgS left caption 400]
 *
 * <div class="instagram">
 *     <blockquote class="instagram-media"
 *       data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS"
 *       data-instgrm-version="14">
 *          <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
 *     </blockquote>
 * </div>
 *
 * <div class="instagram" align="left">
 *     <blockquote class="instagram-media"
 *       style="width: 400px;"
 *       data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS"
 *       data-instgrm-version="14"
 *       data-instgrm-captioned>
 *          <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
 *     </blockquote>
 * </div>
 * <script async defer src="//www.instagram.com/embed.js" type="text/javascript"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Instagram markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const instagramRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 13) return false; // [instagram a/p/b]
        if (currentLine.slice(0, 11) !== '[instagram ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for Instagram match
        // https://www.instagram.com/p/<post> (treat everything prior to <post> as optional, ish)
        const alignment = [ 'left', 'center', 'right' ];
        const match = currentLine.match(`^\\[instagram (?:(?:(?:(?:https?:)?\\/\\/)?(?:www\\.)?instagram\\.com)?\\/)?(?:(?:\\w+)\\/)?(\\w+)((?: (?:${alignment.join('|')}|caption|\\d+))*)\\]$`);
        if (!match) return false;

        // Get the user
        const post = match[1];
        if (!post) return false;

        // Get the raw flags
        const flags = match[2];

        // Get the width
        const widthMatch = flags.match(/\d+/);
        const width = widthMatch ? Math.max(Math.min(Number(widthMatch[0]), 550), 326) : 0;

        // Get the caption
        const showCaption = flags.includes('caption');

        // Get the alignment
        const align = alignment.find(t => flags.includes(t)) || 'center';

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('instagram', 'instagram', 0);
        token.block = true;
        token.markup = match[0];
        token.instagram = { post, width, showCaption, align };

        // Track that we need the script
        state.env.instagram = safeObject(state.env.instagram);
        state.env.instagram.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'instagram', instagramRule);

    /**
     * Parsing rule to inject the Instagram script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const instagramScriptRule = state => {
        if (state.inlineMode) return;

        // Check if we need to inject the script
        if (state.env.instagram && state.env.instagram.tokenized && !state.env.instagram.injected) {
            // Set that we've injected it
            state.env.instagram.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="//www.instagram.com/embed.js" type="text/javascript"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('instagram_script', instagramScriptRule);

    /**
     * Rendering rule for Instagram markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.instagram = (tokens, index) => {
        const token = tokens[index];

        // Construct the attrs
        const attrCaption = token.instagram.showCaption ? ' data-instgrm-captioned' : '';
        const attrAlign = token.instagram.align !== 'center' ? ` align="${md.utils.escapeHtml(token.instagram.align)}"` : '';

        // Escape some HTML
        const post = md.utils.escapeHtml(token.instagram.post);
        const width = md.utils.escapeHtml(token.instagram.width);

        // Return the HTML
        return `<div class="instagram"${attrAlign}>
    <blockquote class="instagram-media" ${width ? `style="width: ${width}px;" ` : ''}data-instgrm-permalink="https://www.instagram.com/p/${post}" data-instgrm-version="14"${attrCaption}>
        <a href="https://instagram.com/p/${post}">View post</a>
    </blockquote>
</div>\n`;
    };
};
