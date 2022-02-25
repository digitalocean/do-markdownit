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
const findAttr = require('../util/find_attr');

/**
 * @typedef {Object} FenceClassesOptions
 * @property {string[]} [allowedClasses] List of case-sensitive classes that are allowed. If not an array, all classes are allowed.
 */

/**
 * Filters classes on code and pre tags in fences.
 *
 * @example
 * ```test
 * hello
 * world
 * ```
 *
 * ```bad
 * hello
 * world
 * ```
 *
 * <pre><code class="language-test">hello
 * world
 * </code></pre>
 *
 * <pre><code class="">hello
 * world
 * </code></pre>
 *
 * @type {import('markdown-it').PluginWithOptions<FenceClassesOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Filter classes for a given HTML tag in HTML content.
     *
     * @param {string} tagName Name of the HTML tag to filter classes for.
     * @param {string} content Full HTML snippet in which the HTML tag is located.
     * @returns {string}
     */
    const filterTag = (tagName, content) => {
        // Locate the tag
        const tagPos = findTagOpen(tagName, content);
        if (!tagPos) return content;

        // Locate the class attribute
        const tag = content.slice(tagPos.start, tagPos.end);
        const classPos = findAttr('class', tag);
        if (!classPos) return content;

        // Extract the class attribute
        const classes = tag.slice(classPos.start + 7, classPos.end - 1).split(' ');
        const permitted = classes.filter(cls => optsObj.allowedClasses.includes(cls));

        // Generate the new tag
        const newTag = `${tag.slice(0, classPos.start + 7)}${permitted.join(' ')}${tag.slice(classPos.end - 1)}`;

        // Return the content with the new tag
        return `${content.slice(0, tagPos.start)}${newTag}${content.slice(tagPos.end)}`;
    };

    /**
     * Wrap the fence render function to filter classes on pre and class tags.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} original Original render function to wrap.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the rendered content
        const content = original(tokens, idx, opts, env, self);

        // If no permitted classes, return the original content
        if (!Array.isArray(optsObj.allowedClasses)) return content;

        // Filter the pre and code tags if present
        return filterTag('code', filterTag('pre', content));
    };

    md.renderer.rules.fence = render(md.renderer.rules.fence);
};
