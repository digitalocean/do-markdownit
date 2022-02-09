'use strict';

const safeObject = require('../util/safe_object');

module.exports = (md, options) => {
    // Get the correct options
    options = safeObject(options);

    md.inline.ruler.before('html_inline', 'html_comment', (state, silent) => {
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
        if (options.strict && !closingMarkFound) return false;

        // Store the comment
        const token = state.push('html_comment', '', 0);
        token.content = state.src.slice(state.pos + 4, closingMark);

        // Move position to after the close index
        state.pos = closingMark + (closingMarkFound ? 3 : 0);

        // Done
        return true;
    });

    md.block.ruler.before('html_block', 'html_comment', (state, startLine, endLine, silent) => {
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
        if (options.strict && !closingMarkFound) return false;

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
    });

    // noop rendering comments
    md.renderer.rules.html_comment = () => '';
};
