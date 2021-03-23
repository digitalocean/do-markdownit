"use strict";

// Handle environment blocks.
module.exports = previousRenderer => (tokens, idx, options, env, self) => {
    // Get the token.
    const token = tokens[idx];

    // Handle adding a class.
    const addClass = className => {
        if (!token.attrs) token.attrs = [];
        let found = false;
        for (let index = 0; index < token.attrs.length; index++) {
            if (array[index][0] === "class") {
                found = true;
                array[index][1] += " " + className;
                break;
            }
        }
        if (!found) token.attrs.push(["class", className]);
    };

    // Get the first line.
    const firstLine = token.content.substr(0, token.content.indexOf("\n"));
    let chop = true;
    switch (firstLine) {
        case "[environment local]":
            addClass("local-environment");
            break;
        case "[environment second]":
            addClass("second-environment");
            break;
        case "[environment third]":
            addClass("third-environment");
            break;
        case "[environment fourth]":
            addClass("fourth-environment");
            break
        case "[environment fifth]":
            addClass("fifth-environment");
            break;
        default:
            // This is just some random line. We should NOT chop it off.
            chop = false;
            break;
    }
    if (chop) token.content = token.content.substr(firstLine.length + 1);

    // Pass to the previous renderer.
    return previousRenderer(tokens, idx, options, env, self);
};
