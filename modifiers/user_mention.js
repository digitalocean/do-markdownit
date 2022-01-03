'use strict';

const safeObject = require('../util/safe_object');

const path = mention => `/users/${mention}`;

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  md.inline.ruler.before('link', 'user_mention', (state, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Check we're on a mention
    if (state.src[state.pos] !== '@') return false;

    // Look for a space or newline to break the mention, or the end of the state
    const spaceIdx = state.src.indexOf(' ', state.pos + 1);
    const newlineIdx = state.src.indexOf('\n', state.pos + 1);
    let endIdx = Math.min(
      state.posMax,
      spaceIdx === -1 ? state.posMax : spaceIdx,
      newlineIdx === -1 ? state.posMax : newlineIdx,
    );

    // Expect at least one character between the @ and the end
    if (endIdx <= state.pos + 1) return false;

    // Apply pattern if set
    if (typeof options.pattern === 'object' && Object.prototype.toString.call(options.pattern) === '[object RegExp]') {
      // Check if the mention matches the pattern
      const full = state.src.slice(state.pos + 1, endIdx);
      const match = full.match(options.pattern);
      if (!match) return false;

      // Check the match is at the start
      if (full.indexOf(match[0]) !== 0) return false;

      // Adjust the end index
      endIdx = state.pos + 1 + match[0].length;
    }

    // Get the mention
    const mention = state.src.slice(state.pos + 1, endIdx);

    // Get the link
    const link = typeof options.path === 'function'
      ? options.path(mention)
      : path(mention);
    if (!link) return false;

    // Add the start token
    const linkToken = state.push('link_open', 'a', 1);
    linkToken.attrSet('href', link);

    // Add the mention as plain text
    const mentionToken = state.push('text', '', 0);
    mentionToken.content = `@${mention}`;

    // Add the end token
    state.push('link_close', 'a', -1);

    // Move position to the end (not after the end, as we need it to render still)
    state.pos = endIdx;

    // Done
    return true;
  });
};
