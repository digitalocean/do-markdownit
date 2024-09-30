/*
Copyright 2024 DigitalOcean

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
 * @module rules/collapsible_heading
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} CollapsibleHeadingOptions
 * @property {number[]} [levels] List of headings to transform.
 * @property {boolean} [open=true] Whether to collapse the content by default.
 * @property {string} [className=collapsible] Class to use for collapsible sections.
 */

/**
 * Add support for collapsing headings.
 *
 * When enabled this plugin wraps the specified headings and the content after in a collapsible section.
 *
 * @example
 * # H1 header
 * Test row
 *
 * <details class="collapsible">
 * <summary>
 * <h1>H1 header</h1>
 * </summary>
 * <p>Test row</p>
 * </details>
 *
 * @type {import('markdown-it').PluginWithOptions<CollapsibleHeadingOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Rule for inserting details around headings.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const collapsibleHeading = state => {
        // Track levels of collapsible headings that're open
        const collapsed = [];
        state.tokens = state.tokens.reduce((newTokens, token) => {
            if (token.type === 'heading_open') {
                const headingLevel = Number(token.tag.replace('h', ''));
                // Close all open collapsible headings deeper than this
                while (collapsed[collapsed.length - 1] >= headingLevel) {
                    // Close the previous detail element
                    const closeDetail = new state.Token('details', 'details', -1);
                    closeDetail.block = true;
                    newTokens.push(closeDetail);

                    // Remove the closed collapsible from the list.
                    collapsed.pop();
                }

                if (Array.isArray(optsObj.levels) && optsObj.levels.includes(headingLevel)) {
                    // Create the outer details element
                    const openDetails = new state.Token('details', 'details', 1);
                    openDetails.block = true;
                    openDetails.attrSet('class', md.utils.escapeHtml(typeof optsObj.className === 'string' ? optsObj.className : 'collapsible'));
                    if (optsObj.open) openDetails.attrSet('open', '');
                    newTokens.push(openDetails);

                    // Create the summary element
                    const openSummary = new state.Token('summary', 'summary', 1);
                    openSummary.block = true;
                    newTokens.push(openSummary);

                    // Add the heading
                    newTokens.push(token);

                    // Track that we have an open collapsible heading
                    collapsed.push(headingLevel);

                    return newTokens;
                }
            }

            if (token.type === 'heading_close'
                && Array.isArray(optsObj.levels)
                && optsObj.levels.includes(Number(token.tag.replace('h', '')))
            ) {
                // Add the heading close
                newTokens.push(token);

                // Close the summary element
                const closeSummary = new state.Token('summary', 'summary', -1);
                closeSummary.block = true;
                newTokens.push(closeSummary);

                return newTokens;
            }

            // Add the current token
            newTokens.push(token);

            return newTokens;
        }, []);

        collapsed.forEach(() => {
            // Close all remaining previous detail elements
            const closeDetail = new state.Token('details', 'details', -1);
            closeDetail.block = true;
            state.tokens.push(closeDetail);
        });
    };

    md.core.ruler.push('collapsbile_heading', collapsibleHeading);
};
