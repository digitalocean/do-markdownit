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
 * Add support for [Asciinema](http://asciinema.org/) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[asciinema <id>]`. E.g. `[asciinema 325730]`.
 * The cols and rows can optionally be set using `[asciinema <id> [cols] [rows]]`. E.g. `[asciinema 325730 100 50]`.
 * The default value for cols is 80, and for rows is 24.
 *
 * @example
 * [asciinema 325730]
 *
 * <script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script>
 * <noscript>
 *     <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
 * </noscript>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for asciinema markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const asciinemaRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 13) return false; // [asciinema a]
        if (currentLine.slice(0, 11) !== '[asciinema ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for asciinema match
        const match = currentLine.match(/^\[asciinema (\d+)(?: (\d+))?(?: (\d+))?\]$/);
        if (!match) return false;

        // Get the id
        const id = Number(match[1]);
        if (!id) return false;

        // Get the columns
        const cols = Number(match[2]) || 80;

        // Get the rows
        const rows = Number(match[3]) || 24;

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('asciinema', 'asciinema', 0);
        token.block = true;
        token.markup = match[0];
        token.asciinema = { id, cols, rows };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'asciinema', asciinemaRule);

    /**
     * Rendering rule for asciinema markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.asciinema = (tokens, index) => {
        const token = tokens[index];

        // Return the HTML
        return `<script src="https://asciinema.org/a/${token.asciinema.id}.js" id="asciicast-${token.asciinema.id}" async data-cols="${token.asciinema.cols}" data-rows="${token.asciinema.rows}"></script>
<noscript>
    <a href="https://asciinema.org/a/${token.asciinema.id}" target="_blank">View asciinema recording</a>
</noscript>\n`;
    };
};
