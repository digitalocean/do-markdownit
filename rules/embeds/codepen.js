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
 * @module @digitalocean/do-markdownit/rules/embeds/codepen
 */

const safeObject = require('../../util/safe_object');

/**
 * Add support for [Codepen](https://codepen.io/) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[codepen <user> <hash>]`. E.g. `[codepen AlbertFeynman gjpgjN]`.
 * After the user and hash, assorted space-separated flags can be added (in any combination/order):
 *
 * - Add `lazy` to set the Codepen embed to not run until the user interacts with it.
 * - Add `dark` to set the Codepen embed to use dark mode.
 * - Add `html` to set the Codepen embed to default to the HTML tab.
 * - Add `css` to set the Codepen embed to default to the CSS tab.
 * - Add `js` to set the Codepen embed to default to the JavaScript tab.
 * - Add `editable` to set the Codepen embed to allow the code to be edited (requires the embedded user to be Pro).
 * - Add any set of digits to set the height of the embed (in pixels).
 *
 * If any two or more of `html`, `css`, and `js` are added, HTML will be preferred, followed by CSS, then JavaScript.
 *
 * @example
 * [codepen AlbertFeynman gjpgjN]
 *
 * [codepen AlbertFeynman gjpgjN lazy dark 512 html]
 *
 * <p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
 *     <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
 * </p>
 *
 * <p class="codepen" data-height="512" data-theme-id="dark" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" data-preview="true" style="height: 512px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
 *     <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
 * </p>
 * <script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Codepen markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const codepenRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 13) return false; // [codepen a b]
        if (currentLine.slice(0, 9) !== '[codepen ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for codepen match
        const match = currentLine.match(/^\[codepen (\S+) (\S+)((?: (?:lazy|dark|html|css|js|editable|\d+))*)\]$/);
        if (!match) return false;

        // Get the user
        const user = match[1];
        if (!user) return false;

        // Get the hash
        const hash = match[2];
        if (!hash) return false;

        // Get the raw flags
        const flags = match[3];

        // Get the height
        const heightMatch = flags.match(/\d+/);
        const height = heightMatch ? Number(heightMatch[0]) : 256;

        // Defines the theme
        const theme = flags.includes('dark') ? 'dark' : 'light';

        // Defines if the embed should lazy load
        const lazy = flags.includes('lazy');

        // Defines if the embed should be editable
        const editable = flags.includes('editable');

        // Defines the default tab
        const tab = [ 'html', 'css', 'js' ].find(t => flags.includes(t)) || 'result';

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('codepen', 'codepen', 0);
        token.block = true;
        token.markup = match[0];
        token.codepen = { user, hash, height, theme, lazy, editable, tab };

        // Track that we need the script
        state.env.codepen = safeObject(state.env.codepen);
        state.env.codepen.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'codepen', codepenRule);

    /**
     * Parsing rule to inject the Codepen script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const codepenScriptRule = state => {
        // Check if we need to inject the script
        if (state.env.codepen && state.env.codepen.tokenized && !state.env.codepen.injected) {
            // Set that we've injected it
            state.env.codepen.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('codepen_script', codepenScriptRule);

    /**
     * Rendering rule for Codepen markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.codepen = (tokens, index) => {
        const token = tokens[index];

        // Construct the attrs
        const attrHeight = ` data-height="${md.utils.escapeHtml(token.codepen.height)}"`;
        const attrTheme = ` data-theme-id="${md.utils.escapeHtml(token.codepen.theme)}"`;
        const attrTab = ` data-default-tab="${md.utils.escapeHtml(token.codepen.tab)}"`;
        const attrUser = ` data-user="${md.utils.escapeHtml(token.codepen.user)}"`;
        const attrHash = ` data-slug-hash="${md.utils.escapeHtml(token.codepen.hash)}"`;
        const attrLazy = token.codepen.lazy ? ' data-preview="true"' : '';
        const attrEditable = token.codepen.editable ? ' data-editable="true"' : '';

        // Escape some HTML
        const user = md.utils.escapeHtml(token.codepen.user);
        const hash = md.utils.escapeHtml(token.codepen.hash);
        const height = md.utils.escapeHtml(token.codepen.height);

        // Return the HTML
        return `<p class="codepen"${attrHeight}${attrTheme}${attrTab}${attrUser}${attrHash}${attrLazy}${attrEditable} style="height: ${height}px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/${user}/pen/${hash}">${hash} by ${user}</a> (<a href="https://codepen.io/${user}">@${user}</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>\n`;
    };
};
