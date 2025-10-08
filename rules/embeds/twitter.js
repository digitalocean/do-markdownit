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
 * @module rules/embeds/twitter
 */

const safeObject = require('../../util/safe_object');

/**
 * Add support for [Twitter](https://twitter.com/) embeds in Markdown, as block syntax, supporting the legacy `twitter.com` or the new `x.com` domain.
 * Input may use either the legacy `twitter.com` or the new `x.com` domain; both are accepted.
 *
 * The basic syntax is `[twitter <tweet>]`.
 * E.g. `[twitter https://twitter.com/MattIPv4/status/1576415168426573825]`.
 * Rendered output always canonicalizes the link to `https://x.com/<user>/status/<id>`.
 * After the tweet, assorted space-separated flags can be added (in any combination/order):
 *
 * - Add `light` or `dark` to set the card theme (default is `light`).
 * - Add `left`, `center`, or `right` to set the alignment of the embed (default is `left`).
 * - Add any set of digits to set the width of the embed (in pixels, between 250 and 550, default is 550).
 *
 * If two or more alignments are selected, `left` will be preferred, followed by `center`, then `right`.
 *
 * If both `light` and `dark` are selected, `dark` will be preferred.
 *
 * If a width outside the range of 250-550 is selected, a clamped value will be used.
 *
 * @example
 * [twitter https://twitter.com/MattIPv4/status/1576415168426573825] Or [twitter https://x.com/MattIPv4/status/1576415168426573825]
 *
 * [twitter https://twitter.com/MattIPv4/status/1576415168426573825 left 400 dark] Or [twitter https://x.com/MattIPv4/status/1576415168426573825 left 400 dark]
 *
 * <div class="twitter">
 *     <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
 *         <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
 *     </blockquote>
 * </div>
 *
 * <div class="twitter" align="left">
 *     <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="dark">
 *         <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
 *     </blockquote>
 * </div>
 * <script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Twitter markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const twitterRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 11) return false; // [twitter a/status/b]
        if (currentLine.slice(0, 9) !== '[twitter ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for Twitter match (accept both twitter.com and x.com domains)
        // https://www.twitter.com/<user>/status/<id> or https://www.x.com/<user>/status/<id> (treat everything prior to <user> as optional, ish)
        const alignment = [ 'left', 'center', 'right' ];
        const settings = [ 'light', 'dark' ];
        const match = currentLine.match(`^\\[twitter (?:(?:(?:(?:https?:)?\\/\\/)?(?:www\\.)?(?:twitter|x)\\.com)?\\/)?(\\w+)\\/status\\/(\\d+)((?: (?:${alignment.concat(settings).join('|')}|\\d+))*)\\]$`);
        if (!match) return false;

        // Get the user
        const user = match[1];
        if (!user) return false;

        // Get the id
        const id = match[2];
        if (!id) return false;

        // Get the raw flags
        const flags = match[3];

        // Get the width
        const widthMatch = flags.match(/\d+/);
        const width = widthMatch ? Math.max(Math.min(Number(widthMatch[0]), 550), 250) : 550;

        // Get the theme
        const theme = flags.includes('dark') ? 'dark' : 'light';

        // Get the alignment
        const align = alignment.find(t => flags.includes(t)) || 'center';

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('twitter', 'twitter', 0);
        token.block = true;
        token.markup = match[0];
        token.twitter = { user, id, width, theme, align };

        // Track that we need the script
        state.env.twitter = safeObject(state.env.twitter);
        state.env.twitter.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'twitter', twitterRule);

    /**
     * Parsing rule to inject the Twitter script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const twitterScriptRule = state => {
        if (state.inlineMode) return;

        // Check if we need to inject the script
        if (state.env.twitter && state.env.twitter.tokenized && !state.env.twitter.injected) {
            // Set that we've injected it
            state.env.twitter.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('twitter_script', twitterScriptRule);

    /**
     * Rendering rule for Twitter markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.twitter = (tokens, index) => {
        const token = tokens[index];

        // Construct the attrs
        const attrWidth = ` data-width="${md.utils.escapeHtml(token.twitter.width)}"`;
        const attrTheme = ` data-theme="${md.utils.escapeHtml(token.twitter.theme)}"`;
        const attrAlign = token.twitter.align !== 'center' ? ` align="${md.utils.escapeHtml(token.twitter.align)}"` : '';

        // Escape some HTML
        const user = md.utils.escapeHtml(token.twitter.user);
        const id = md.utils.escapeHtml(token.twitter.id);

        // Return the HTML
        // Apply the alignment to the parent div, as Twitter does float-based alignment
        return `<div class="twitter"${attrAlign}>
    <blockquote class="twitter-tweet" data-dnt="true"${attrWidth}${attrTheme}>
    <a href="https://x.com/${user}/status/${id}">View tweet by @${user}</a>
    </blockquote>
</div>\n`;
    };
};
