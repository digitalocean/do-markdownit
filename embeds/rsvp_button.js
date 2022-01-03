'use strict';

const safeObject = require('../util/safe_object');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  md.block.ruler.before('paragraph', 'rsvp_button', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (just current line)
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);

    // Perform some non-regex checks for speed
    if (currentLine.length < 15) return false; // [rsvp_button a]
    if (currentLine.slice(0, 13) !== '[rsvp_button ') return false;
    if (currentLine[currentLine.length - 1] !== ']') return false;

    // Check for rsvp button match
    const match = currentLine.match(/^\[rsvp_button (\d+)(?: "(.{1,50})")?\]$/);
    if (!match) return false;

    // Get the id
    const id = Number(match[1]);
    if (!id) return false;

    // Get the button text
    const text = (match[2] || '').trim() || 'RSVP Here';

    // Update the pos for the parser
    state.line = startLine + 1;

    // Add token to state
    const token = state.push('rsvp_button', 'rsvp_button', 0);
    token.block = true;
    token.markup = match[0];
    token.rsvp_button = { id, text };

    // Done
    return true;
  });

  md.renderer.rules.rsvp_button = (tokens, index) => {
    const token = tokens[index];

    // Get the class name to use
    const className = typeof options.className === 'string' ? options.className : 'rsvp';

    // Return the HTML
    return `<button data-js="rsvp-button" data-form-id="${md.utils.escapeHtml(token.rsvp_button.id)}" disabled="disabled" class="${md.utils.escapeHtml(className)}">
    ${md.utils.escapeHtml(token.rsvp_button.text)}
</button>\n`;
  };
};
