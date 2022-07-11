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
 * @module rules/table_wrapper
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} TableWrapperOptions
 * @property {string} [className='table-wrapper'] Class to use for the table wrapper.
 */

/**
 * Add wrapper element around Markdown `tables` for better controlled overflow.
 *
 * No new syntax added. This just wraps normal Markdown `| a |` tables with a `div` that has a default
 * class of `table-wrapper`.
 *
 * @example
 * | a |
 * |---|
 *
 * <div class="table-wrapper">
 *     <table>
 *         <thead>
 *             <tr>
 *                 <th>a</th>
 *             </tr>
 *         </thead>
 *     </table>
 * </div>
 *
 * @type {import('markdown-it').PluginWithOptions<TableWrapperOptions>}
 */
module.exports = (md, options) => {
    const optsObj = safeObject(options);
    const className = typeof optsObj.className === 'string' ? optsObj.className : 'table-wrapper';

    /**
     * Parsing rule for wrapping `tables` with a `div`  with `table-wrapper` class.
     *
     * @type {import('markdown-it/lib/parser_core').RuleCore}
     * @private
     */
    const tableWrapperRule = state => {
        state.tokens = state.tokens.reduce((newTokens, token) => {
            // Add opening `div` with the `table-wrapper` class before all `table` opening tags
            if (token.type === 'table_open') {
                const tableWrapperOpen = new state.Token('div_open', 'div', 1);
                tableWrapperOpen.attrSet('class', className);
                newTokens.push(tableWrapperOpen);
                newTokens.push(token);
                // Add closing `div` after all `table` closing tags
            } else if (token.type === 'table_close') {
                const tableWrapperClose = new state.Token('div_close', 'div', -1);
                newTokens.push(token);
                newTokens.push(tableWrapperClose);
            } else {
                newTokens.push(token);
            }

            return newTokens;
        }, []);
    };

    md.core.ruler.after('inline', 'table_wrapper', tableWrapperRule);
};
