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
 * @module modifiers/heading_id
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} HeadingIdOptions
 * @property {HashLinkOptions} [hashLink] Override default hash link options.
 * @property {function(string): string} [sluggify] Custom function to convert heading content to a slug Id.
 */

/**
 * @typedef {Object} HashLinkOptions
 * @property {number} [maxLevel=3] Max heading level to generate hash links for.
 * @property {string} [class='hash-anchor'] Class name to use on the hash link.
 * @property {'before'|'after'} [position='before'] Position of the hash link relative to the heading.
 * @property {boolean} [linkHeading=true] Whether to link the heading text to the hash link.
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
 * @private
 */
const sluggify = string => string.toLowerCase()
    .replace(/\W+/g, '-')
    .replace(/--+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Extract all plain-text tokens from a token, including its children.
 *
 * @param {import('markdown-it/lib/token')} token Token to extract text from.
 * @returns {string}
 * @private
 */
const extractText = token => {
    let res = '';
    if (token.type === 'text' || token.type === 'code_inline') res += token.content;
    if (token.children) res += token.children.map(extractText).join('');
    return res;
};

/**
 * Apply Ids to all rendered headings and generate an array of headings.
 *
 * Headings are available after a render via `md.headings`.
 * Each item in the array is an object with the following properties:
 *
 * - `slug`: The slug Id given to the heading (e.g. `my-heading`).
 * - `content`: The raw Markdown content of the heading (e.g. `My **Heading**`).
 * - `text`: The plain-text content of the heading (e.g. `My Heading`).
 * - `rendered`: The rendered HTML content of the heading (e.g. `My <strong>Heading</strong>`).
 * - `level`: The heading level (e.g. `1`).
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

    // Set default hashLink options
    const hashLinkOpts = {
        class: 'hash-anchor',
        maxLevel: 3,
        position: 'before',
        linkHeading: true,
    };

    // Apply hashLink options if set to valid values
    if (typeof optsObj.hashLink === 'object' && optsObj.hashLink !== null) {
        if (typeof optsObj.hashLink.class === 'string') hashLinkOpts.class = optsObj.hashLink.class;
        if (typeof optsObj.hashLink.maxLevel === 'number') hashLinkOpts.maxLevel = optsObj.hashLink.maxLevel;
        if ([ 'before', 'after' ].includes(optsObj.hashLink.position)) hashLinkOpts.position = optsObj.hashLink.position;
        if (typeof optsObj.hashLink.linkHeading === 'boolean') hashLinkOpts.linkHeading = optsObj.hashLink.linkHeading;
    }

    /**
     * Wrap the heading render function to inject slug Ids and track all headings.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} [original] Original render function. Defaults to `renderToken`.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // Get the raw content, the text and the rendered version
        const { content } = tokens[idx + 1];
        const text = extractText(tokens[idx + 1]);
        const rendered = self.render([ tokens[idx + 1] ], opts, env);

        // Get the level for the heading
        const level = Number(token.tag.slice(1));
        if (Number.isNaN(level)) throw new Error(`Invalid heading level: ${token.tag}`);

        // Generate an id if not already set
        if (!token.attrs) token.attrs = [];
        let idAttr = token.attrs.find(attr => attr[0] === 'id');
        if (!idAttr) {
            idAttr = [ 'id', typeof optsObj.sluggify === 'function'
                ? optsObj.sluggify(content)
                : sluggify(content) ];
            token.attrs.push(idAttr);
        }

        // If linkHeading is set, wrap the heading in a link
        if (optsObj.hashLink !== false && hashLinkOpts.linkHeading) {
            // Grab the constructor from current token
            const Token = token.constructor;

            // Generate tokens for hash link
            const linkOpen = new Token('link_open', 'a', 1);
            linkOpen.attrs = [ [ 'href', `#${idAttr[1]}` ] ];
            const linkClose = new Token('link_close', 'a', -1);

            // Inject hash link tokens
            tokens[idx + 1].children.unshift(linkOpen);
            tokens[idx + 1].children.push(linkClose);
        }

        // Generate hash link if option is set
        if (optsObj.hashLink !== false && level <= hashLinkOpts.maxLevel) {
            // Grab the constructor from current token
            const Token = token.constructor;

            // Generate tokens for hash link
            const linkOpen = new Token('link_open', 'a', 1);
            linkOpen.attrs = [ [ 'class', hashLinkOpts.class ], [ 'href', `#${idAttr[1]}` ], [ 'aria-hidden', true ] ];
            const linkContent = new Token('text', '', 0);
            const linkClose = new Token('link_close', 'a', -1);

            // Inject hash link tokens
            if (hashLinkOpts.position === 'before') tokens[idx + 1].children.unshift(linkOpen, linkContent, linkClose);
            else tokens[idx + 1].children.push(linkOpen, linkContent, linkClose);
        }

        // Expose the heading
        md.headings.push({ slug: idAttr[1], content, text, rendered, level });

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
     * @private
     */
    const reset = original => (src, env) => {
        md.headings = [];
        return original.apply(md, [ src, env ]);
    };

    md.render = reset(md.render);
    md.renderInline = reset(md.renderInline);
};
