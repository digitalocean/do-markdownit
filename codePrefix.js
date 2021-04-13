"use strict";

// Defines the regex for a code prefix.
const CODE_PREFIX = /^ *custom_prefix\((.*)\)$/;

// Attempt to parse the prefix. Returns a blank string if it can't.
const parsePrefix = firstLine => {
    // Check if we have a match.
    const match = firstLine.match(CODE_PREFIX);
    if (match === null) {
        // No prefix.
        return ["", 0];
    }

    // Return the sub-match.
    return [match[1], match[0].length];
};

// Handles code prefixes.
module.exports = previousRenderer => (tokens, idx, options, env, self) => {
    // Get the token.
    const token = tokens[idx];

    // Try and figure out if the first line is meaningful.
    let prefix = "";
    let purgeNumber = 0;
    switch (token.info.toLowerCase()) {
        case "command":
            prefix = "$";
            purgeNumber = 7;
            break;
        case "super_user":
            prefix = "#";
            purgeNumber = 10;
            break;
        default:
            [prefix, purgeNumber] = parsePrefix(token.info);
            break;
    }

    // Purge the correct number of characters.
    token.info = token.info.substr(purgeNumber);

    // If there was a prefix, we should process it.
    if (prefix !== "") {
        // Split since we need to edit each of them.
        const split = token.content.split("\n");

        // Loop through each index.
        for (let index = 0; index < split.length; index++) {
            // Get the content.
            const element = split[index];

            // Ignore if completely blank.
            if (element === "") continue;

            // Add the prefix.
            split[index] = prefix + " " + element;
        }

        // Set the content to it to the split rejoined.
        token.content = split.join("\n");
    }

    // Pass to the previous renderer.
    return previousRenderer(tokens, idx, options, env, self);
};
