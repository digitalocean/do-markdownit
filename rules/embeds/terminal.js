'use strict';

const safeObject = require('../../util/safe_object');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  md.block.ruler.before('paragraph', 'terminal', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (just current line)
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);

    // Perform some non-regex checks for speed
    if (currentLine.length < 12) return false; // [terminal a]
    if (currentLine.slice(0, 10) !== '[terminal ') return false;
    if (currentLine[currentLine.length - 1] !== ']') return false;

    // Check for terminal match
    const match = currentLine.match(/^\[terminal (\S+)(?: (.+))?\]$/);
    if (!match) return false;

    // Get the docker image
    const image = match[1].trim();
    if (!image) return false;

    // Get the button text
    const text = (match[2] || '').trim() || 'Launch an Interactive Terminal!';

    // Update the pos for the parser
    state.line = startLine + 1;

    // Add token to state
    const token = state.push('terminal', 'terminal', 0);
    token.block = true;
    token.markup = match[0];
    token.terminal = { image, text };

    // Done
    return true;
  });

  md.renderer.rules.terminal = (tokens, index) => {
    const token = tokens[index];

    // Get the class name to use
    const className = typeof options.className === 'string' ? options.className : 'terminal';

    // Return the HTML
    return `<button data-js="terminal" data-docker-image="${md.utils.escapeHtml(token.terminal.image)}" disabled="disabled" class="${md.utils.escapeHtml(className)}">
    ${md.utils.escapeHtml(token.terminal.text)}
</button>\n`;
  };
};
