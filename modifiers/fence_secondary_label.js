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

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');

/**
 * @typedef {Object} FenceSecondaryLabelOptions
 * @property {string} [className='secondary-code-label'] Class name to use on the label div.
 */

/**
 * Add support for secondary label markup at the start of a fence, translating to a label div inside the fence.
 *
 * Markup must be at the start of the fence, though may be preceded by other metadata markup using square brackets.
 *
 * @example
 * ```
 * [secondary_label test]
 * hello
 * world
 * ```
 *
 * <pre><code><div class="secondary-code-label" title="test">test</div>hello
 * world
 * </code></pre>
 *
 * @type {import('markdown-it').PluginWithOptions<FenceSecondaryLabelOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Wrap the fence render function to detect secondary label markup and replace it with the correct class.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} original Original render function to wrap.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // Look for a label at the start of the content
        const match = token.content.match(/^((?:\[.+\]\n)*?)\[secondary_label (.+)\]\n/);
        const name = (match && (match[2] || '').trim()) || null;

        // If no name, just return original
        if (!name) return original(tokens, idx, opts, env, self);

        // Remove the label line
        token.content = token.content.replace(match[0], match[1]);

        // Get the rendered content
        const content = original(tokens, idx, opts, env, self);

        // Locate the code block start
        const open = findTagOpen('code', content);

        // Get the class name to use
        const className = optsObj.className || 'secondary-code-label';

        // Inject label and return
        return `${content.slice(0, open.end)}<div class="${md.utils.escapeHtml(className)}" title="${md.utils.escapeHtml(name)}">${md.utils.escapeHtml(name)}</div>${content.slice(open.end)}`;
    };

    md.renderer.rules.fence = render(md.renderer.rules.fence);
};
