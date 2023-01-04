/*
Copyright 2023 DigitalOcean

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
 * @module modifiers/underline
 */

/**
 * Add support for underline markup across all Markdown.
 *
 * The syntax for underline text is `__`. E.g. `__hello world__`.
 * This replaces the default behaviour for the syntax, which would be bold.
 * This syntax is treated as regular inline syntax, similar to bold or italics.
 *
 * @example
 * __test__
 *
 * <p><u>test</u></p>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Wrap the strong open/close render functions to switch `__` syntax to underline.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} [original] Original render function. Defaults to `renderToken`.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // If the token is for bold, and uses the `__` syntax, render as underline
        if (token.tag === 'strong' && token.markup === '__') token.tag = 'u';

        // Render as normal
        return typeof original === 'function'
            ? original(tokens, idx, opts, env, self)
            : self.renderToken(tokens, idx, opts, env);
    };

    md.renderer.rules.strong_open = render(md.renderer.rules.strong_open);
    md.renderer.rules.strong_close = render(md.renderer.rules.strong_close);
};
