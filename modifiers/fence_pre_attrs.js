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

/**
 * @module modifiers/fence_pre_attrs
 */

const findTagOpen = require('../util/find_tag_open');

/**
 * Move all attributes from the opening `code` tag of a fenced code block to the `pre` tag.
 *
 * @example
 * ```js
 * hello
 * world
 * ```
 *
 * <pre class="language-js"><code>hello
 * world
 * </code></pre>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Wrap the fence render function to move attributes from `code` to `pre`.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} original Original render function to wrap.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the rendered content
        
        const token = tokens[idx];
        if (token.info === 'mermaid') {
			return `<pre class="environment-local"><code class="mermaid">${token.content}</code></pre>`;
        }
        
        const content = original(tokens, idx, opts, env, self);

        // Locate the pre tag
        const pre = findTagOpen('pre', content);

        // Locate the code tag
        const code = findTagOpen('code', content);

        // Move code attrs to pre
        return `${content.slice(0, pre.start)}<pre${content.slice(pre.start + 4, pre.end - 1)}${content.slice(code.start + 5, code.end - 1)}><code>${content.slice(code.end)}`;
    };

    md.renderer.rules.fence = render(md.renderer.rules.fence);
};
