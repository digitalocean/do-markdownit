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

const safeObject = require('../../util/safe_object');

/**
 * Add support for [glob](https://www.digitalocean.com/community/tools/glob) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[glob <pattern> <strings>]`. E.g. `[glob *.js a.js b.js c.css]`.
 * After the pattern, strings can be provided on a single line, or each separated by a newline.
 * If a newline is included, the full first line will be treated as the pattern, including any spaces.
 *
 * @example
 * [glob *.js /]
 *
 * [glob * test.js
 * /a
 * /b]
 *
 * <div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
 *     <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
 *         Explore <code>*.js</code> as a glob string in our glob testing tool
 *     </a>
 * </div>
 *
 * <div data-glob-tool-embed data-glob-string="* test.js" data-glob-test-0="/a" data-glob-test-1="/b">
 *     <a href="https://www.digitalocean.com/community/tools/glob?glob=*+test.js&tests=%2Fa&tests=%2Fb" target="_blank">
 *         Explore <code>* test.js</code> as a glob string in our glob testing tool
 *     </a>
 * </div>
 * <script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for glob markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const globRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (current line to end)
        const currentLines = Array.from({ length: endLine - startLine }, (_, i) => {
            const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
            const max = state.eMarks[startLine + i];
            return state.src.substring(pos, max);
        }).join('\n');

        // Perform some non-regex checks for speed
        if (currentLines.length < 10) return false; // [glob a b]
        if (currentLines.slice(0, 6) !== '[glob ') return false;

        // Look for any double linebreaks (these cannot be inside glob)
        const breakIdx = currentLines.indexOf('\n\n');

        // Attempt to find closing mark (ensure there is a newline at the end if mark is at end of doc)
        const closingMark = `${breakIdx === -1 ? currentLines : currentLines.slice(0, breakIdx)}\n`.indexOf(']\n');
        if (closingMark === -1) return false;

        // Check for glob match
        const match = currentLines.slice(0, closingMark + 3).match(/^\[glob (.+?(?:(?: .+?)+|(?:\n.+?)+))\](?:$|\n)/);
        if (!match) return false;

        // Get the full strings
        const strings = match[1].split(match[1].includes('\n') ? '\n' : ' ').filter(x => !!x);

        // Get the glob
        const glob = strings[0];
        if (!glob) return false;

        // Get the tests
        const tests = strings.slice(1);
        if (!tests.length) return false;

        // Update the pos for the parser
        state.line = startLine + match[0].trim().split('\n').length;

        // Add token to state
        const token = state.push('glob', 'glob', 0);
        token.block = true;
        token.markup = match[0];
        token.glob = { glob, tests };

        // Track that we need the script
        state.env.glob = safeObject(state.env.glob);
        state.env.glob.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'glob', globRule);

    /**
     * Parsing rule to inject the glob script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const globScriptRule = state => {
        // Check if we need to inject the script
        if (state.env.glob && state.env.glob.tokenized && !state.env.glob.injected) {
            // Set that we've injected it
            state.env.glob.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('glob_script', globScriptRule);

    /**
     * Rendering rule for glob markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.glob = (tokens, index) => {
        const token = tokens[index];

        // Construct the tests attributes
        const tests = token.glob.tests.map((x, i) => `data-glob-test-${i}="${md.utils.escapeHtml(x)}"`).join(' ');

        // Construct the fallback URL
        const url = new URL('https://www.digitalocean.com/community/tools/glob');
        url.searchParams.append('glob', token.glob.glob);
        token.glob.tests.forEach(x => url.searchParams.append('tests', x));

        // Return the HTML
        return `<div data-glob-tool-embed data-glob-string="${md.utils.escapeHtml(token.glob.glob)}" ${tests}>
    <a href="${url.toString()}" target="_blank">
        Explore <code>${md.utils.escapeHtml(token.glob.glob)}</code> as a glob string in our glob testing tool
    </a>
</div>\n`;
    };
};
