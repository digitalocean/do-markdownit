'use strict';

const safeObject = require('../util/safe_object');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  md.inline.ruler.before('link', 'rsvp_button', (state, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Perform some non-regex checks for speed
    if (state.src[state.pos] !== '[') return false;
    if (state.posMax - state.pos < 15) return false; // [rsvp_button a]
    if (state.src.slice(state.pos, state.pos + 13) !== '[rsvp_button ') return false;

    // Check for rsvp button match
    const match = state.src.slice(state.pos).match(/^\[rsvp_button (\d+)(?: "(.{1,50})")?\]/);
    if (!match) return false;

    // Get the id
    const id = Number(match[1]);
    if (!id) return false;

    // Get the button text
    const text = (match[2] || '').trim() || 'RSVP Here';

    // Add token to state
    const token = state.push('rsvp_button', 'rsvp_button', 0);
    token.block = true;
    token.markup = match[0];
    token.rsvp_button = { id, text };

    // Move position to the end
    state.pos += match[0].length;

    // Done
    return true;
  });

  md.renderer.rules.rsvp_button = (tokens, index) => {
    const token = tokens[index];

    // Get the class name to use
    const className = typeof options.className === 'string' ? options.className : 'rsvp';

    // Return the HTML
    return `<button data-js="rsvp-button" data-form-id="${md.utils.escapeHtml(token.rsvp_button.id)}" disabled="disabled" class="${md.utils.escapeHtml(className)}">${md.utils.escapeHtml(token.rsvp_button.text)}</button>`;
  };
};
