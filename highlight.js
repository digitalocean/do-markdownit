"use strict";

// Handle highlight tokenization.
module.exports.tokenize = (state, silent) => {
	// Handle sanity checking the iniital document.
	if (silent) return false;
	if (state.pos + 6 >= state.posMax) return false;

	// Now check if it is possible for it to be a highlight.
	let pos = state.pos;
	if (
		state.src.charCodeAt(state.pos) !== 60 // <
		|| state.src.charCodeAt(state.pos + 1) !== 94 // ^
		|| state.src.charCodeAt(state.pos + 2) !== 62 // >
	) return false;
	const initPos = pos;
	pos += 3;

	// Keep going and trying to find something,
	let matchState = 0;
	for (; pos < state.posMax; pos++) {
		if (matchState === 3) break;
		switch (state.src.charCodeAt(pos)) {
			case 60: // <
				if (matchState !== 0) {
                    // Ensure this isn't something like <^<>.
                    matchState = 0;
                } else {
                    // Next step.
                    matchState = 1;
                }
				break;
			case 94: // ^
				if (matchState !== 1) {
                    // Ensure this isn't something like <^^>.
                    matchState = 0;
                } else {
                    // Next step.
                    matchState = 2;
                }
				break;
			case 62: // >
				if (matchState !== 2) {
                    // Ensure this isn't something like <>^>.
                    matchState = 0;
                } else {
                    // End step.
                    matchState = 3;
                }
				break;
			default: // *other*
				if (matchState !== 0) {
					// This would be <x^> for example.
					// If we hit this, we reset to the beginning of the end again.
					matchState = 0;
				}
				break;
		}
	}

	// If the matchState isn't 3, it's not valid.
	if (matchState !== 3) return false;

	// Else we should set the cursor to -3 from the local position for the max and +3 from the initial position for the min.
	// We also backup the old maximum, we'll need it after tokenization to restore the maximum to what it was.
	const oldMax = state.posMax;
	state.pos = initPos + 3;
	state.posMax = pos - 3;

	// Lets add the tokens.
	state.push("mark_open", "mark", 1);
	state.md.inline.tokenize(state);
	state.push("mark_close", "mark", -1);

	// Restore the old maximum position.
	state.posMax = oldMax;

	// Set the new current position to pos.
	state.pos = pos;

	// Return true on successful parse.
	return true;
};

// Defines the code block to find highlights in code blocks.
const CODE_BLOCK_HIGHLIGHT_REGEX = /(?<!\\)&lt;(?<!\\)\^(?<!\\)&gt;(.*)(?<!\\)&lt;(?<!\\)\^(?<!\\)&gt;/g;

// Handle code block/inline support.
module.exports.code = previousRenderer => (tokens, idx, options, env, self) => {
    // Get the result of the previous renderer.
    let result = previousRenderer(tokens, idx, options, env, self);

    // Find and replace highlights with the correct tags.
    result = result.replace(CODE_BLOCK_HIGHLIGHT_REGEX, "<mark>$1</mark>");

    // Return the result.
    return result;
};
