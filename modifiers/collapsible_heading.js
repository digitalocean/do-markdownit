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
 * @module modifiers/link_attributes
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} CollapsibleHeadingOptions
 * @property {string[]} [levels] List of headings to transform.
 * @property {boolean} [open=true] Whether to collapse the content by default.
 */

/**
 * Add support for mentioning users, using an `@` symbol. Wraps the mention in a link to the user.
 *
 * By default, any characters that are not a space or newline after an `@` symbol will be treated as a mention.
 *
 * @example
 * Hello @test
 *
 * <p>Hello <a href="/users/test">@test</a></p>
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
        const collapsed = [];
        state.tokens = state.tokens.reduce((newTokens, token) => {
            if (token.type === 'heading_open') {
                const headingLevel = Number(token.tag.replace('h', ''));
                // Close all hanging collapsible sections.
                while (collapsed[collapsed.length - 1] >= headingLevel) {
                    // Close the previous detail element
                    const closeDetail = new state.Token('details', 'details', -1);
                    closeDetail.block = true;
                    newTokens.push(closeDetail);

                    // Remove the closed collapsible from the list.
                    collapsed.pop();
                }

                if (Array.isArray(optsObj.levels) && optsObj.levels.includes(token.tag)) {
                    // Create the outer details element
                    const openDetails = new state.Token('details', 'details', 1);
                    openDetails.block = true;
                    openDetails.attrSet('class', 'collapsible');
                    if (optsObj.open) openDetails.attrSet('open', '');
                    newTokens.push(openDetails);

                    // Create the summary element
                    const openSummary = new state.Token('summary', 'summary', 1);
                    openSummary.block = true;
                    newTokens.push(openSummary);

                    // Add the heading
                    newTokens.push(token);

                    collapsed.push(headingLevel);

                    return newTokens;
                }
            }

            if (token.type === 'heading_close' && Array.isArray(optsObj.levels) && optsObj.levels.includes(token.tag)) {
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
