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
 * @module rules/image_caption
 */

/**
 * Wrap singleton images that have title text in a figure with a rendered caption.
 *
 * @example
 * ![alt text](test.png "title text")
 *
 * ![alt text](test.png "title text _with Markdown_")
 *
 * <figure><img src="test.png" alt="alt text"><figcaption>title text</figcaption></figure>
 *
 * <figure><img src="test.png" alt="alt text"><figcaption>title text <em>with Markdown</em></figcaption></figure>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for wrapping singleton image that has a title in a figure with a caption.
     *
     * @type {import('markdown-it/lib/parser_core').RuleCore}
     * @private
     */
    const imageCaptionRule = state => {
        // Iterate over all tokens, except the first and last
        for (let i = 1; i < state.tokens.length - 1; i += 1) {
            const token = state.tokens[i];

            // Check if we have an image
            if (token.type !== 'inline') continue;
            if (token.children.length !== 1) continue;
            if (token.children[0].type !== 'image') continue;

            // Check if we have a title
            const title = token.children[0].attrGet('title');
            if (!title) continue;

            // Check this is the only item in the paragraph
            const open = state.tokens[i - 1];
            const close = state.tokens[i + 1];
            if (open.type !== 'paragraph_open') continue;
            if (close.type !== 'paragraph_close') continue;

            // Mutate open/close to become a figure, not a paragraph
            open.type = 'figure_open';
            open.tag = 'figure';
            close.type = 'figure_close';
            close.tag = 'figure';

            // Inject the caption, treating the title as inline Markdown
            token.children.push(new state.Token('figcaption_open', 'figcaption', 1));
            const parsedTitle = md.parseInline(title, state.env);
            if (parsedTitle.length) {
                token.children.push(...parsedTitle[0].children);
            }
            token.children.push(new state.Token('figcaption_close', 'figcaption', -1));
            token.children[0].attrs = token.children[0].attrs.filter(([ attr ]) => attr !== 'title');
        }
    };

    md.core.ruler.after('inline', 'image_caption', imageCaptionRule);
};
