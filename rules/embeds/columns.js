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

const safeObject = require('../../util/safe_object');

/**
 * @typedef {Object} ColumnsOptions
 * @property {string} [outerClassName='columns'] Class to use for the outer columns container.
 * @property {string} [innerClassName='column'] Class to use for the inner column container.
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
 * @type {import('markdown-it').PluginWithOptions<ColumnsOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);
    const outerClassName = typeof optsObj.outerClassName === 'string' ? optsObj.outerClassName : 'columns';
    const innerClassName = typeof optsObj.innerClassName === 'string' ? optsObj.innerClassName : 'column';

    /**
     * Find a column block within the given lines, starting at the first line, returning the closing index.
     *
     * @param {string[]} lines Lines of Markdown to parse.
     * @returns {false|number}
     * @private
     */
    const findColumn = lines => {
        // Perform some basic checks to ensure the column is valid
        if (lines.length < 3) return false; // [column + content + ]
        if (lines[0] !== '[column') return false;

        // Attempt to find the closing bracket for this, allowing bracket pairs inside
        let closingIndex = -1;
        let open = 0;
        for (let i = 1; i < lines.length; i += 1) {
            // If we found an opening bracket that isn't closed on the same line, increase the open count
            if (lines[i][0] === '[' && lines[i][lines[i].length - 1] !== ']') open += 1;

            // If we found a closing bracket, check if we're at the same level as the opening bracket
            if (lines[i] === ']') {
                if (open === 0) {
                    closingIndex = i;
                    break;
                }
                open -= 1;
            }
        }

        return closingIndex === -1 ? false : closingIndex;
    };

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

        // Find adjacent columns starting from
        const columns = [];
        let nextLine = 0;
        while (true) { // eslint-disable-line no-constant-condition
            const column = findColumn(currentLines.slice(nextLine));
            if (column === false) break;

            // Add the column to the list
            columns.push([ nextLine, nextLine + column ]);
            nextLine += column + 1;

            // Skip a single blank line between columns
            if (currentLines[nextLine] === '') nextLine += 1;
        }

        // If we found less than two columns, don't do anything
        if (columns.length < 2) return false;

        // Create the outer columns container
        const tokenContainerOpen = state.push('columns', 'div', 1);
        tokenContainerOpen.block = true;
        tokenContainerOpen.map = [ startLine, startLine + columns[columns.length - 1][1] ];
        tokenContainerOpen.attrSet('class', outerClassName);

        for (const column of columns) {
            // Ensure we only tokenize the content of the column
            const oldParentType = state.parentType;
            const oldLineMax = state.lineMax;
            state.parentType = 'column';
            state.lineMax = startLine + column[1];

            // Add the opening token to state
            const tokenOpen = state.push('column', 'div', 1);
            tokenOpen.block = true;
            tokenOpen.map = [ startLine + column[0], startLine + column[1] ];
            tokenOpen.markup = currentLines[0];
            tokenOpen.attrSet('class', innerClassName);

            // Process the content of the column as block content
            state.md.block.tokenize(state, startLine + column[0] + 1, startLine + column[1]);

            // Add the closing token to state
            const tokenClose = state.push('column', 'div', -1);
            tokenClose.block = true;
            tokenClose.markup = ']';

            // Reset the parser to continue on
            state.parentType = oldParentType;
            state.lineMax = oldLineMax;
        }

        // Add the closing token to state
        const tokenContainerClose = state.push('columns', 'div', -1);
        tokenContainerClose.block = true;

        // Move the parser past this content
        state.line = startLine + columns[columns.length - 1][1] + 1;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'columns', columnsRule);
};
