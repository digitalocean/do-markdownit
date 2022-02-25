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

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} HtmlCommentOptions
 * @property {boolean} [strict=false] If the end of a comment must be explicitly found.
 */

/**
 * Removes all HTML comments from Markdown.
 *
 * This treats HTML comments as Markdown syntax, so expects them to either be inline, or a full block.
 * Comments that start inline and then span a block will not be removed.
 *
 * By default, removal is loose, meaning that it does not need to explicitly find the end of a comment to remove it.
 * If no closing mark is found, the end of the line or block is assumed.
 * This behaviour can be disabled with the `strict` setting, which will require finding the end of the comment.
 *
 * @example
 * Hello <!-- comment --> world
 *
 * <p>Hello  world</p>
 *
 * @type {import('markdown-it').PluginWithOptions<HtmlCommentOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Parsing rule for remove inline HTML comments.
     *
     * @type {import('markdown-it/lib/parser_inline').RuleInline}
     */
    const htmlCommentInlineRule = (state, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Check we have space for the opening marker, and we're on one
        if (state.pos + 4 > state.posMax || state.src.slice(state.pos, state.pos + 4) !== '<!--') return false;

        // Look for closing marker
        // If the closing marker is beyond the end, or not found, use the end
        const closingMarkRaw = state.src.indexOf('-->', state.pos + 4);
        const closingMarkFound = closingMarkRaw !== -1 && closingMarkRaw <= state.posMax - 3;
        const closingMark = closingMarkFound ? closingMarkRaw : state.posMax;

        // If strict, require that we found the actual closing marker
        if (optsObj.strict && !closingMarkFound) return false;

        // Store the comment
        const token = state.push('html_comment', '', 0);
        token.content = state.src.slice(state.pos + 4, closingMark);

        // Move position to after the close index
        state.pos = closingMark + (closingMarkFound ? 3 : 0);

        // Done
        return true;
    };

    md.inline.ruler.before('html_inline', 'html_comment', htmlCommentInlineRule);

    /**
     * Parsing rule for remove block HTML comments.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     */
    const htmlCommentBlockRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (current line to end)
        const currentLines = Array.from({ length: endLine - startLine }, (_, i) => {
            const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
            const max = state.eMarks[startLine + i];
            return state.src.substring(pos, max);
        }).join('\n');

        // Perform some non-regex checks for speed
        if (currentLines.length < 4) return false; // <!--
        if (currentLines.slice(0, 4) !== '<!--') return false;

        // Attempt to find closing mark (ensure there is a newline at the end if mark is at end of doc)
        // If the closing mark is not found, use the end
        const closingMarkRaw = `${currentLines}\n`.indexOf('-->\n');
        const closingMarkFound = closingMarkRaw !== -1;
        const closingMark = closingMarkFound ? closingMarkRaw : currentLines.length;

        // If strict, require that we found the actual closing marker
        if (optsObj.strict && !closingMarkFound) return false;

        // Get the comment
        const comment = currentLines.slice(0, closingMark + (closingMarkFound ? 3 : 0));

        // Update the pos for the parser
        state.line = startLine + comment.split('\n').length;

        // Add token to state
        const token = state.push('html_comment', '', 0);
        token.block = true;
        token.markup = comment;
        token.content = comment.slice(4, closingMark);

        // Done
        return true;
    };

    md.block.ruler.before('html_block', 'html_comment', htmlCommentBlockRule);

    /**
     * Noop rendering HTML comments.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     */
    md.renderer.rules.html_comment = () => '';
};
