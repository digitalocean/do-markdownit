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
 * @module rules/embeds/columns
 */

/**
 * Add support for columns in Markdown, as block syntax.
 *
 * To declare a column, wrap content with `[column` on the line before, and `]` on a new line at the end.
 * Two or more columns must be adjacent to each other to be parsed as a set of columns.
 *
 * @example
 * [column
 * Content for the first column
 * ]
 * [column
 * Content for the second column
 * ]
 *
 * <div class="columns">
 * <div class="column">
 * <p>Content for the first column</p>
 * </div>
 * <div class="column">
 * <p>Content for the second column</p>
 * </div>
 * </div>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for column markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const columnsRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (current line to end)
        const currentLines = Array.from({ length: endLine - startLine }, (_, i) => {
            const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
            const max = state.eMarks[startLine + i];
            return state.src.substring(pos, max);
        });

        // Perform some non-regex checks for speed
        if (currentLines.length < 3) return false; // [column + content + ]
        if (currentLines[0] !== '[column') return false;

        // Attempt to find the closing bracket for this, allowing bracket pairs inside
        let closingIndex = -1;
        let open = 0;
        for (let i = 1; i < currentLines.length; i++) {
            // If we found an opening bracket that isn't closed on the same line, increase the open count
            if (currentLines[i][0] === '[' && currentLines[i][currentLines[i].length - 1] !== ']') open++;

            // If we found a closing bracket, check if we're at the same level as the opening bracket
            if (currentLines[i] === ']') {
                if (open === 0) {
                    closingIndex = i;
                    break;
                }
                open--;
            }
        }
        if (closingIndex === -1) return false;

        // TODO: Check there are more columns immediately after the closing bracket

        // Ensure we only tokenize the content of the column
        const nextLine = startLine + closingIndex;
        const oldParentType = state.parentType;
        const oldLineMax = state.lineMax;
        state.parentType = 'column';
        state.lineMax = nextLine;

        // Add the opening token to state
        const tokenOpen = state.push('column', 'div', 1);
        tokenOpen.attrSet('class', 'column');
        tokenOpen.block = true;
        tokenOpen.markup = currentLines[0];
        tokenOpen.map = [ startLine, nextLine ];

        // Process the content of the column as block content
        state.md.block.tokenize(state, startLine + 1, nextLine);

        // Add the opening token to state
        const tokenClose = state.push('column', 'div', -1);
        tokenClose.markup = ']';
        tokenClose.block  = true;

        // Update the parser to continue on
        state.parentType = oldParentType;
        state.lineMax = oldLineMax;
        state.line = nextLine + 1;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'columns', columnsRule);
};
