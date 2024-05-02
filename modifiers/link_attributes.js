/*
Copyright 2024 DigitalOcean

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
 * @module modifiers/link_attributes
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} LinkAttributesOptions
 * @property {Object<string, string>|function(Object<string, string>): Object<string, string>} attributes Object or function to generate attributes for links.
 */

/**
 * Apply custom attributes to all links in the Markdown content.
 *
 * If an object is provided, the provided attributes are merged with the existing attributes.
 *
 * If a function is provided, the existing attributes are passed to it,
 *  and the existing attributes are replaced (not merged) with the return value.
 *
 * @type {import('markdown-it').PluginWithOptions<LinkAttributesOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Wrap the link render function to inject custom attributes.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} [original] Original render function. Defaults to `renderToken`.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // Handle a function for transforming attributes
        // Otherwise, merge the attributes
        if (typeof optsObj.attributes === 'function') {
            const currentAttrs = Object.fromEntries(token.attrs);
            token.attrs = Object.entries(optsObj.attributes(currentAttrs));
        } else {
            token.attrs = Object.entries({ ...Object.fromEntries(token.attrs), ...optsObj.attributes });
        }

        // Render as normal
        return typeof original === 'function'
            ? original(tokens, idx, opts, env, self)
            : self.renderToken(tokens, idx, opts, env);
    };

    md.renderer.rules.link_open = render(md.renderer.rules.link_open);
};
