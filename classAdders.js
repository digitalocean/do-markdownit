"use strict";

// Used to add classes.
module.exports = (state, silent) => {
    // Handle sanity checking the iniital document.
	if (silent) return false;
	if (state.pos + 9 >= state.posMax) return false;

	// Now check if it is possible for it to be a highlight.
	let pos = state.pos;
	if (
		state.src.charCodeAt(state.pos) !== 60 // <
		|| state.src.charCodeAt(state.pos + 1) !== 36 // $
		|| state.src.charCodeAt(state.pos + 2) !== 62 // >
		|| state.src.charCodeAt(state.pos + 3) !== 91 // [
	) return false;
	pos += 4;

    // Scan for the ].
    const classStart = pos;
    for (; pos < state.posMax; pos++) {
        if (state.src.charCodeAt(pos) === 93) {
            // We hit the end of the tag.
            break;
        }
    }
    const classEnd = pos;

    // If pos is equal to posMax, invalid tag.
    if (pos === state.posMax) return false;

    // Add 1 to pos (end of ]).
    pos++;

    // Get the class names.
    const classNames = state.src.substr(classStart, classEnd - classStart);
    if (classNames.includes("\n")) return false;

    // Keep going and trying to find something,
	let matchState = 0;
	for (; pos < state.posMax; pos++) {
		if (matchState === 3) break;
		switch (state.src.charCodeAt(pos)) {
			case 60: // <
				if (matchState !== 0) {
                    // Ensure this isn't something like <$<>.
                    matchState = 0;
                } else {
                    // Next step.
                    matchState = 1;
                }
				break;
			case 36: // $
				if (matchState !== 1) {
                    // Ensure this isn't something like <$$>.
                    matchState = 0;
                } else {
                    // Next step.
                    matchState = 2;
                }
				break;
			case 62: // >
				if (matchState !== 2) {
                    // Ensure this isn't something like <>$>.
                    matchState = 0;
                } else {
                    // End step.
                    matchState = 3;
                }
				break;
			default: // *other*
				if (matchState !== 0) {
					// This would be <x$> for example.
					// If we hit this, we reset to the beginning of the end again.
					matchState = 0;
				}
				break;
		}
	}

	// If the matchState isn't 3, it's not valid.
	if (matchState !== 3) return false;

    // Else we should set the cursor and backup the old value.
	const oldMax = state.posMax;
	state.pos = classEnd + 1;
	state.posMax = pos - 3;

	// Lets add the tokens.
	const token = state.push("span_open", "span", 1);
    token.attrs = [["class", classNames]];
	state.md.block.tokenize(state);
	state.push("span_close", "span", -1);

	// Restore the old maximum position.
	state.posMax = oldMax;

	// Set the new current position to pos.
	state.pos = pos;

	// Return true on successful parse.
	return true;
};
