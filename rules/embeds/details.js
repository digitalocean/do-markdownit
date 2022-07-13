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
 * @module rules/embeds/details
 */

const blockLines = require('../../util/block_lines');
const findBlockEmbed = require('../../util/find_block_embed');

/**
 * Add support for expandable details in Markdown, as block syntax.
 *
 * To create an expandable details section, use `[details` followed by a summary.
 * Content for the expanded section should be provided on lines after, closed with `]` on a new line.
 *
 * @example
 * [details This is hidden content
 * Content for inside the expanded section
 * ]
 *
 * [details open This section is *open* by default
 * Content for inside the expanded section
 * ]
 *
 * <details>
 * <summary>This is hidden content</summary>
 * <p>Content for inside the expanded section</p>
 * </details>
 *
 * <details open>
 * <summary>This section is <em>open</em> by default</summary>
 * <p>Content for inside the expanded section</p>
 * </details>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for details markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const detailsRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (current line to end)
        const currentLines = blockLines(state, startLine, endLine);

        // Attempt to find the block
        const block = findBlockEmbed(currentLines, 'details');
        if (block === false) return false;

        // Check that we have content
        const parts = currentLines[0].split(' ');
        if (parts.length === 1) return false;
        const stateSelection = [ 'open', 'closed' ].includes(parts[1].toLowerCase()) ? parts[1].toLowerCase() : null;
        if (parts.length === 2 && stateSelection) return false;

        // Create the outer details element
        const tokenDetailsOpen = state.push('details', 'details', 1);
        tokenDetailsOpen.block = true;
        tokenDetailsOpen.map = [ startLine, startLine + block ];
        if (stateSelection === 'open') tokenDetailsOpen.attrSet('open', '');

        // Create the summary element
        const tokenSummaryOpen = state.push('summary', 'summary', 1);
        tokenSummaryOpen.block = true;
        tokenSummaryOpen.map = [ startLine, startLine + 1 ];
        tokenSummaryOpen.markup = currentLines[0];

        // Create an inline token for the summary
        const tokenSummary = state.push('inline', '', 0);
        tokenSummary.content = parts.slice(stateSelection ? 2 : 1).join(' ');
        tokenSummary.map = [ startLine, startLine + 1 ];
        tokenSummary.children = [];

        // Close the summary element
        const tokenSummaryClose = state.push('summary', 'summary', -1);
        tokenSummaryClose.block = true;

        // Ensure we only tokenize the content of the column
        const oldParentType = state.parentType;
        const oldLineMax = state.lineMax;
        state.parentType = 'details';
        state.lineMax = startLine + block;

        // Process the content of the details as block content
        state.md.block.tokenize(state, startLine + 1, startLine + block);

        // Close the outer details element
        const tokenContainerClose = state.push('details', 'details', -1);
        tokenContainerClose.block = true;

        // Move the parser past this content
        state.parentType = oldParentType;
        state.lineMax = oldLineMax;
        state.line = startLine + block + 1;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'details', detailsRule);
};
