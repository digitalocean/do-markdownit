"use strict";

// Handle code metadata.
module.exports = (md, previousRenderer) => (tokens, idx, options, env, self) => {
    // Get the token.
    const token = tokens[idx];

    // Defines any content before this.
    let htmlBefore = "";

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

    // Handles environment parsing.
    const parseEnvironment = line => {
        // Check the line.
        switch (line) {
            case "[environment local]":
                addClass("local-environment");
                return true;
            case "[environment second]":
                addClass("second-environment");
                return true;
            case "[environment third]":
                addClass("third-environment");
                return true;
            case "[environment fourth]":
                addClass("fourth-environment");
                return true;
            case "[environment fifth]":
                addClass("fifth-environment");
                return true;
        }

        // Not this.
        return false;
    };

    // Defines HTML at the start of the markdown.
    let markdownStartHtml = "";

    // Handle label parsing.
    const parseLabel = line => {
        if (line.startsWith("[label ")) {
            // Make sure the label isn't broken.
            if (!line.endsWith("]")) return false;

            // Get the label text.
            const labelText = line.substr(7, line.length - 8);

            // Sanitize the label text.
            const safeLabelText = md.utils.escapeHtml(labelText);

            // Add the label HTML.
            htmlBefore += `<div class="code-label" title="${safeLabelText}">${safeLabelText}</div>`;

            // Return true.
            return true;
        }

        // Not a match.
        return false;
    };

    // Handle secondary label parsing.
    const parseSecondaryLabel = line => {
        if (line.startsWith("[secondary_label ")) {
            // Make sure the label isn't broken.
            if (!line.endsWith("]")) return false;

            // Get the label text.
            const labelText = line.substr(17, line.length - 18);

            // Sanitize the label text.
            const safeLabelText = md.utils.escapeHtml(labelText);

            // Add the label HTML.
            markdownStartHtml += `<div class="secondary-code-label" title="${safeLabelText}">${safeLabelText}</div>`;

            // Return true.
            return true;
        }

        // Not a match.
        return false;
    };

    // Get each first line.
    for (;;) {
        // Per loop initialisations.
        let chop = true;
        const line = token.content.substr(0, token.content.indexOf("\n"));

        // Go through the parser chain.
        if (!(chop = parseEnvironment(line))) {
            if (!(chop = parseLabel(line))) {
                chop = parseSecondaryLabel(line);
            }
        }

        // Chop if required.
        if (chop) token.content = token.content.substr(line.length + 1);
        else break;
    }

    // Process HTML on the inner of the markdown.
    const processInnerMdHtml = () => {
        if (markdownStartHtml) {
            // Create a unique ID which we can substitute later.
            let uniqueId;
            for (;;) {
                uniqueId = Math.random().toString(36).substring(7);
                if (uniqueId.length > 5) break;
            }

            // Add this to the token content.
            token.content = uniqueId + "\n" + token.content;

            // Call the renderer.
            const renderedContent = previousRenderer(tokens, idx, options, env, self);

            // Replace the first instance of the unique ID with the inner markdown HTML and return it.
            return renderedContent.replace(uniqueId, markdownStartHtml);
        }

        // No HTML to add.
        return previousRenderer(tokens, idx, options, env, self);
    };

    // Pass to the previous renderer and inject the new HTML content before its.
    return htmlBefore + processInnerMdHtml();
};
