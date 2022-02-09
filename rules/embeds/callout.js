'use strict';

const safeObject = require('../../util/safe_object');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  md.block.ruler.before('paragraph', 'callout', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (current line to end)
    const currentLines = Array.from({ length: endLine - startLine }, (_, i) => {
      const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
      const max = state.eMarks[startLine + i];
      return state.src.substring(pos, max);
    }).join('\n');

    // Perform some non-regex checks for speed
    if (currentLines.length < 10) return false; // <$>[a]b<$>
    if (currentLines.slice(0, 4) !== '<$>[') return false;

    // Attempt to find closing mark (ensure there is a newline at the end if mark is at end of doc)
    const closingMark = (currentLines + '\n').indexOf('<$>\n');
    if (closingMark === -1) return false;

    // Check for callout match
    const match = currentLines.slice(0, closingMark + 4).match(/^<\$>\[([^\]\n]+)\]([\s\S]+?)\n?<\$>(?:$|\n)/);
    if (!match) return false;

    // Get the class name
    const className = match[1].trim();
    if (!className) return false;

    // Check class name is allowed
    if (options.allowedClasses && !options.allowedClasses.includes(className)) return false;

    // Set the parent type
    const oldParentType = state.parentType;
    state.parentType = 'callout';

    // Update the pos for the parser
    state.line = startLine + match[0].trim().split('\n').length;

    // Add opening token to state
    const tokenOpen = state.push('callout_open', 'div', 1);
    tokenOpen.block = true;
    tokenOpen.markup = `<$>[${match[1]}]`;
    tokenOpen.callout = { className };
    tokenOpen.map = [ startLine, state.line ];

    // Get the content within
    state.bMarks[startLine] = state.bMarks[startLine] + `<$>[${match[1]}]`.length;
    state.eMarks[state.line - 1] = state.eMarks[state.line - 1] - '<$>'.length;
    state.md.block.tokenize(state, startLine, state.line);

    // Add closing token to state
    const tokenClose = state.push('callout_close', 'div', -1);
    tokenClose.block = true;
    tokenClose.markup = `<$>`;

    // Reset parent type
    state.parentType = oldParentType;

    // Done
    return true;
  });

  md.renderer.rules.callout_open = (tokens, index) => {
    const token = tokens[index];
    const classes = options.extraClasses
      ? `${options.extraClasses} ${token.callout.className}`
      : `${token.callout.className}`;
    return `<div class="${md.utils.escapeHtml(classes)}">\n`;
  };

  md.renderer.rules.callout_close = () => {
    return '</div>\n';
  };
};
