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
 * Get the current lines to consider for Markdown-It block rules.
 *
 * @param {import('markdown-it/lib/rules_block/state_block').StateBlock} state State of the parser.
 * @param {number} startLine Starting line for current parser state.
 * @param {number} endLine Ending line for current parser state.
 * @returns {string[]}
 * @private
 */
module.exports = (state, startLine, endLine) => Array.from({ length: endLine - startLine }, (_, i) => {
    const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
    const max = state.eMarks[startLine + i];
    return state.src.substring(pos, max);
});
