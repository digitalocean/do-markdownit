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

/**
 * @typedef {Object} HeadingIdOptions
 * @property {function(string): string} [sluggify] Custom function to convert heading content to a slug Id.
 */

/**
 * Standard function to sluggify a given string.
 *
 * Converts the string to lowercase.
 * Replaces all non-alphanumeric characters with a hyphen.
 * Removes duplicate hyphens, and removes hyphens from the start/end.
 *
 * @param {string} string String to be sluggified.
 * @returns {string}
 */
const sluggify = string => string.toLowerCase()
    .replace(/\W+/g, '-')
    .replace(/--+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Apply Ids to all rendered headings and generate an array of headings.
 *
 * Headings are available after a render via `md.headings`.
 * Each item in the array is an object with the following properties:
 *
 * - `slug`: The slug Id given to the heading (e.g. `my-heading`).
 * - `content`: The content of the heading (e.g. `My Heading`).
 *
 * @example
 * # Hello World!
 *
 * <h1 id="hello-world">Hello World!</h1>
 *
 * @type {import('markdown-it').PluginWithOptions<HeadingIdOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Wrap the heading render function to inject slug Ids and track all headings.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} [original] Original render function. Defaults to `renderToken`.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // Get the content
        const { content } = tokens[idx + 1];

        // Generate an id if not already set
        if (!token.attrs) token.attrs = [];
        if (token.attrs.every(attr => attr[0] !== 'id')) {
            // Get the slug
            const slug = typeof optsObj.sluggify === 'function' ? optsObj.sluggify(content) : sluggify(content);

            // Add the slug as the id attribute
            token.attrs.push([ 'id', slug ]);

            // Expose the slug in md
            md.headings.push({ slug, content });
        }

        // Render as normal
        return typeof original === 'function'
            ? original(tokens, idx, opts, env, self)
            : self.renderToken(tokens, idx, opts, env);
    };

    md.renderer.rules.heading_open = render(md.renderer.rules.heading_open);

    /**
     * Wrap the core render functions to reset the tracked headings.
     *
     * @param {function(string, *?): string} original Original render function to wrap.
     * @returns {function(string, *?): string}
     */
    const reset = original => (src, env) => {
        md.headings = [];
        return original.apply(md, [ src, env ]);
    };

    md.render = reset(md.render);
    md.renderInline = reset(md.renderInline);
};
