'use strict';

module.exports = md => {
  md.inline.ruler.before('emphasis', 'highlight', (state, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Check we're on an opening marker
    if (state.src.slice(state.pos, state.pos + 3) !== '<^>') return false;

    // Look for closing marker
    const closeIdx = state.src.indexOf('<^>', state.pos + 3);
    if (closeIdx === -1 || closeIdx > state.posMax - 3) return false;

    // Add the start token
    state.push('mark_open', 'mark', 1);

    // Adjust position to be inside the markers
    const oldPosMax = state.posMax;
    state.pos = state.pos + 3;
    state.posMax = closeIdx;

    // Tokenize the inner
    state.md.inline.tokenize(state);

    // Move position to after the close marker
    state.pos = closeIdx + 3;
    state.posMax = oldPosMax;

    // Add the end token
    state.push('mark_close', 'mark', -1);

    // Done
    return true;
  });

  const code = original => (tokens, idx, options, env, self) => {
    // Run the original renderer
    return original(tokens, idx, options, env, self)
      // Replacing any pairs of escaped markers
      .replace(/&lt;\^&gt;(.*?)&lt;\^&gt;/g, '<mark>$1</mark>');
  };

  md.renderer.rules.code_block = code(md.renderer.rules.code_block);
  md.renderer.rules.fence = code(md.renderer.rules.fence);
  md.renderer.rules.code_inline = code(md.renderer.rules.code_inline);
};
