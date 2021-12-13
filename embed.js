"use strict";

// Handle custom embeds.
module.exports = (md, formId, ampRequest, canonicalUrl, previousRenderer) => (tokens, options, env) => {
    // Handle glob pre-processing.
    const globPreprocessing = {};
    const handleTokens = tokens => {
        for (const token of tokens) {
            // Handle content if there's any.
            if (token.content) {
                for (;;) {
                    // Check for any glob matches.
                    const match = token.content.match(/\[glob (.+?(?:(?: +.+?)+|(?:[\n\r]+.+?)+))\]/);
                    if (!match) break;
            
                    // Create a unique ID which we can substitute later.
                    let uniqueId;
                    for (;;) {
                        uniqueId = Math.random().toString(36).substring(7);
                        if (uniqueId.length > 5) break;
                    }
            
                    // Get the glob string.
                    const globString = match[1];
            
                    // Store it under a unique ID and replace it.
                    globPreprocessing[uniqueId] = globString;
                    token.content = token.content.replace(match[0], uniqueId);
                }
            }

            // Handle children if there's any.
            if (token.children) handleTokens(token.children);
        }
    };
    handleTokens(tokens);

    // Call the renderer.
    let content = previousRenderer(tokens, options, env);

    // Handle RSVP buttons.
    if (md.options.html) {
        // Check if this has a form ID.
        if (formId) {
            // Get the RSVP button.
            for (;;) {
                // Get the match.
                const match = content.match(/\[rsvp_button (\d+)(?: "([^"]{1,50})")?\]/);
                if (!match) break;

                // Get the form ID.
                const formId = match[1];

                // Get the button text.
                let buttonText = "RSVP Here";
                if (!buttonText) buttonText = match[2];

                // Replace with the HTML.
                let innerHtml;
                if (ampRequest && canonicalUrl) {
                    innerHtml = `<button href="${canonicalUrl}#dialog=#dialog_${formId}" class="button blue-button large-button margin-top-medium">
    ${buttonText}
</button>`;
                } else {
                    innerHtml = `<button data-js="rsvp-button" data-form_id="${formId}" class="button blue-button large-button margin-top-medium hidden" data-toggle="dialog" data-target="#dialog_${formId}">
    ${buttonText}
</button>`;
                }

                // Replace the match.
                content = content.replace(match[0], innerHtml);
            }
        }
    }

    // Replace any DNS strings.
    for (;;) {
        // Get the DNS match.
        const match = content.match(/\[dns (.+?)( .+)?\]/);
        if (!match) break;

        // Get the domain.
        const domain = md.utils.escapeHtml(match[1]);

        // Get the types.
        const removeBlankSplit = a => {
            if (a[0] === "") a.shift();
            return a;
        };
        const types = md.utils.escapeHtml(match[2] ? removeBlankSplit(match[2].split(" ")).join(",") : "A");

        // Replace with the HTML.
        content = content.replace(match[0], `<div data-dns-tool-embed data-dns-domain="${domain}" data-dns-types="${types}">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=${domain}" target="_blank">
        Perform a full DNS lookup for ${domain}
    </a>
</div>`);
    }

    // Replace any asciinema strings.
    for (;;) {
        // Get the asciinema match.
        const match = content.match(/\[asciinema\s+(\d+)(?:\s+(\d+))?(?:\s+(\d+))?\]/);
        if (!match) break;

        // Get the ID.
        const id = match[1];
        if (!id) {
            content = content.replace(match[0], "");
            continue;
        }

        // Get the columns.
        let cols = Number(match[2]);
        if (!cols) cols = 80;

        // Get the rows.
        let rows = Number(match[3]);
        if (!rows) rows = 24;

        // Replace with the HTML.
        content = content.replace(match[0], `<script src="https://asciinema.org/a/${id}.js" id="asciicast-${id}" async data-cols="${cols}" data-rows="${rows}"></script><noscript><a href="https://asciinema.org/a/${id}" target="_blank">View asciinema recording</a></noscript>`);
    }

    // Replace any codepen strings.
    for (;;) {
        // Get the codepen match.
        const match = content.match(/\[codepen\s+(\S+)\s+(\S+)((?:\s+(?:lazy|dark|html|css|js|editable|\d+))*)\]/);
        if (!match) break;

        // Get the user.
        if (!match[1]) {
            content = content.replace(match[0], "");
            continue;
        }
        const user = md.utils.escapeHtml(match[1]);

        // Get the hash.
        if (!match[2]) {
            content = content.replace(match[0], "");
            continue;
        }
        const hash = md.utils.escapeHtml(match[2]);

        // Get the flags.
        const flags = match[3];

        // Get the size.
        const sizeMatch = flags.match(/\d+/);
        const size = sizeMatch ? Number(sizeMatch[0]) : 256;

        // Defines the theme.
        const theme = flags.includes("dark") ? "dark" : "light";

        // Defines the preview information.
        const preview = flags.includes("lazy") ? ' data-preview="true"' : "";

        // Defines the edit information.
        const editable = flags.includes("editable") ? ' data-preview="editable"' : "";

        // Defines the default tab.
        const default_ = flags.includes("html") ? "html" : flags.includes("css") ? "css" : flags.includes("js") ? "js" : "result";

        // Replace with the HTML.
        content = content.replace(match[0], `<p class="codepen" data-height="${size}" data-theme-id="${theme}" data-default-tab="${default_}" data-user="${user}" data-slug-hash="${hash}"${preview}${editable}
    style="height: ${size}px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/${user}/pen/${hash}">${hash} by ${user}</a> (<a href="https://codepen.io/${user}">@${user}</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>`);
    }

    // Replace any glob strings.
    for (const key of Object.keys(globPreprocessing)) {
        // Get the tests (and glob string, but we'll take that).
        const tests = globPreprocessing[key].split(" ");

        // Get the glob string.
        const glob = tests.shift();

        // If no tests, make the result blank.
        if (tests.length === 0) {
            content = content.replace(key, "");
            break;
        }

        // Defines the HTML for the glob tool.
        const globHtml = `<div data-glob-tool-embed data-glob-string="${md.utils.escapeHtml(glob)}" ${tests.map((x, i) => {
    return `data-glob-test-${i}="${md.utils.escapeHtml(x)}"`;
}).join(" ")}>
    <a href="https://www.digitalocean.com/community/tools/glob?glob=${md.utils.escapeHtml(glob)}&${md.utils.escapeHtml(tests.map(x => `tests=${encodeURIComponent(x)}`).join("&"))}" target="_blank">
        Explore <code>${md.utils.escapeHtml(glob)}</code> as a glob string in our glob testing tool
    </a>
</div>`;

        // Deal with replacing the key.
        content = content.replace(key, globHtml);
    }

    // Replace any youtube strings.
    for (;;) {
        // Get the youtube match.
        const match = content.match(/\[youtube (.+?)(?:\s(\d+))?(?:\s(\d+))?\]/);
        if (!match) break;

        // Get the video id.
        const videoId = md.utils.escapeHtml(match[1]);

        // Get the video height.
        const videoHeight = Number(match[2]) || 300;

        // Get the video width.
        const videoWidth = Number(match[3]) || 300;

        // Replace with the HTML.
        content = content.replace(match[0], `<iframe src="https://www.youtube.com/embed/${videoId}" height="${videoHeight}" width="${videoWidth}" frameborder="0" allowfullscreen />`);
    }

    // Return the content.
    return content;
};
