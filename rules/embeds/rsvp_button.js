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
 * @typedef {Object} RsvpButtonOptions
 * @property {string} [className='rsvp'] Class to use for the button.
 */

/**
 * Add support for RSVP buttons in Markdown, as inline syntax.
 *
 * The basic syntax is `[rsvp_button <marketo id>]`. E.g. `[rsvp_button 12345]`.
 * Optionally, a title can be set for the button in double quotes after the id. E.g. `[rsvp_button 12345 "My Button"]`.
 * The button title is limited to 50 characters, and contain spaces.
 *
 * The buttons are disabled by default and do not have any event listeners.
 * Once rendered, you should bind your own event listeners and enable the buttons.
 *
 * You can find all the buttons in the DOM by looking for the `data-js` attribute being set to `rsvp-button`.
 * The Marketo form Id will be set as the `data-form-id` attribute.
 *
 * @example
 * [rsvp_button 12345 "button title"]
 *
 * <p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">button title</button></p>
 *
 * @type {import('markdown-it').PluginWithOptions<RsvpButtonOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Parsing rule for RSVP button markup.
     *
     * @type {import('markdown-it/lib/parser_inline').RuleInline}
     */
    const rsvpButtonRule = (state, silent) => {
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
    };

    md.inline.ruler.before('link', 'rsvp_button', rsvpButtonRule);

    /**
     * Rendering rule for RSVP button markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     */
    md.renderer.rules.rsvp_button = (tokens, index) => {
        const token = tokens[index];

        // Get the class name to use
        const className = typeof optsObj.className === 'string' ? optsObj.className : 'rsvp';

        // Return the HTML
        return `<button data-js="rsvp-button" data-form-id="${md.utils.escapeHtml(token.rsvp_button.id)}" disabled="disabled" class="${md.utils.escapeHtml(className)}">${md.utils.escapeHtml(token.rsvp_button.text)}</button>`;
    };
};
