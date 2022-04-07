/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const safeObject = require('../../util/safe_object');

/**
 * @typedef {Object} TerminalButtonOptions
 * @property {string} [className='terminal'] Class to use for the button.
 */

/**
 * Add support for terminal buttons in Markdown, as block syntax.
 *
 * The basic syntax is `[terminal <image name>]`. E.g. `[terminal ubuntu:focal]`.
 * An optional button title can be provided after the image name. E.g. `[terminal ubuntu:focal Start Terminal]`.
 *
 * The buttons are disabled by default and do not have any event listeners.
 * Once rendered, you should bind your own event listeners and enable the buttons.
 *
 * You can find all the buttons in the DOM by looking for the `data-js` attribute being set to `terminal`.
 * The image name will be set as the `data-docker-image` attribute.
 *
 * @example
 * [terminal ubuntu:focal button title]
 *
 * <button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
 *     button title
 * </button>
 *
 * @type {import('markdown-it').PluginWithOptions<TerminalButtonOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Parsing rule for terminal markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const terminalRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 12) return false; // [terminal a]
        if (currentLine.slice(0, 10) !== '[terminal ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for terminal match
        const match = currentLine.match(/^\[terminal (\S+)(?: (.+))?\]$/);
        if (!match) return false;

        // Get the docker image
        const image = match[1].trim();
        if (!image) return false;

        // Get the button text
        const text = (match[2] || '').trim() || 'Launch an Interactive Terminal!';

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('terminal', 'terminal', 0);
        token.block = true;
        token.markup = match[0];
        token.terminal = { image, text };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'terminal', terminalRule);

    /**
     * Rendering rule for terminal markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.terminal = (tokens, index) => {
        const token = tokens[index];

        // Get the class name to use
        const className = typeof optsObj.className === 'string' ? optsObj.className : 'terminal';

        // Return the HTML
        return `<button data-js="terminal" data-docker-image="${md.utils.escapeHtml(token.terminal.image)}" disabled="disabled" class="${md.utils.escapeHtml(className)}">
    ${md.utils.escapeHtml(token.terminal.text)}
</button>\n`;
    };
};
