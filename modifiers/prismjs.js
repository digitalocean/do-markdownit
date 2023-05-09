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
 * @module modifiers/prismjs
 */

const Prism = require('../vendor/prismjs');

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');
const findAttr = require('../util/find_attr');
const { languages, languageAliases, getDependencies } = require('../util/prism_util');

/**
 * @typedef {Object} PrismJsOptions
 * @property {string} [delimiter=','] String to split fence information on.
 */

/**
 * Helper to load in a language if not yet loaded.
 *
 * @param {string} language Prism language name to be loaded.
 * @private
 */
const loadLanguage = language => {
    if (language in Prism.languages) return;
    try {
        // eslint-disable-next-line import/no-dynamic-require
        require(`../vendor/prismjs/components/prism-${language}`)(Prism);
    } catch (err) {
        console.error('Failed to load Prism language', language, err);
    }
};

// Load our HTML plugin
require('../util/prism_keep_html')(Prism);

/**
 * Extract a code block (content inside a `<code>` tag in a `<pre>` element), applying a given language class.
 *
 * @param {string} html HTML snippet that contains the code block.
 * @param {{original: string, clean: string}} language Language information (user-provided original, and clean name).
 * @returns {{before: string, after: string, inside: string}}
 * @private
 */
const extractCodeBlock = (html, language) => {
    let workingHtml = html;

    // Find the pre tag
    const pre = findTagOpen('pre', workingHtml);
    if (!pre) throw new Error('Pre not opened');

    // Find any existing classes
    const preTag = workingHtml.slice(pre.start, pre.end);
    const preClsPos = findAttr('class', preTag) || { start: preTag.length, end: preTag.length - 1 };
    const preCls = new Set(preTag.slice(preClsPos.start + 7, preClsPos.end - 1).split(' ').filter(Boolean));

    // Remove the original language class
    if (preCls.has(language.original)) preCls.delete(language.original);

    // Inject the clean language
    preCls.add(`language-${language.clean}`);

    // Inject classes back into the pre tag
    const preUp = `${preTag.slice(0, preClsPos.start - 1)} class="${[ ...preCls ].join(' ')}"${preTag.slice(preClsPos.end)}`;
    workingHtml = `${workingHtml.slice(0, pre.start)}${preUp}${workingHtml.slice(pre.end)}`;
    pre.end = pre.start + preUp.length;

    // Find the code tag
    const code = findTagOpen('code', workingHtml.slice(pre.end));
    if (!code) throw new Error('Code not opened');
    if (workingHtml.slice(pre.end, pre.end + code.start).trim()) throw new Error('Code not first child of pre');

    // Find the closing code tag
    const codeClose = workingHtml.slice(pre.end).lastIndexOf('</code>');
    if (codeClose === -1) throw new Error('Code not closed');

    // Find the closing pre tag
    const preClose = workingHtml.slice(pre.end + codeClose).lastIndexOf('</pre>');
    if (preClose === -1) throw new Error('Pre not closed');
    if (workingHtml.slice(pre.end + codeClose + 7, pre.end + codeClose + preClose).trim()) throw new Error('Code not only child of pre');

    // Get the HTML around the code
    const before = workingHtml.slice(0, pre.end + code.end);
    const after = workingHtml.slice(pre.end + codeClose);

    // Get the code inside the code tag
    const inside = workingHtml.slice(pre.end + code.end, pre.end + codeClose);

    return {
        before,
        inside,
        after,
    };
};

/**
 * Apply PrismJS syntax highlighting to fenced code blocks, based on the language set in the fence info.
 *
 * This loads a custom PrismJS plugin to ensure that any existing HTML markup inside the code block is preserved.
 * This plugin is similar to the default `keep-markup` plugin, but works in a non-browser environment.
 *
 * @example
 * ```nginx
 * server {
 *     try_files test =404;
 * }
 * ```
 *
 * <pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
 *     <span class="token directive"><span class="token keyword">try_files</span> test =404</span><span class="token punctuation">;</span>
 * <span class="token punctuation">}</span>
 * </code></pre>
 *
 * @type {import('markdown-it').PluginWithOptions<PrismJsOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Wrap the fence render function to detect a language and highlight the code using PrismJS.
     *
     * @param {import('markdown-it/lib/renderer').RenderRule} original Original render function to wrap.
     * @returns {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    const render = original => (tokens, idx, opts, env, self) => {
        // Get the token
        const token = tokens[idx];

        // Render original
        const rendered = original(tokens, idx, opts, env, self);

        try {
            // Find language from token info
            const tokenInfo = (token.info || '').split(optsObj.delimiter || ',');
            const language = tokenInfo.map(info => {
                const clean = info.toLowerCase().trim();
                return { clean: languageAliases.get(clean) || clean, original: info };
            }).find(({ clean }) => languages.has(clean));

            // If no language, return original
            if (!language) return rendered;

            // Extract the code from the code block
            const { before, inside, after } = extractCodeBlock(rendered, language);

            // Load requirements for language
            getDependencies(language.clean).forEach(loadLanguage);
            loadLanguage(language.clean);

            // If we failed to load the language (it's a dynamic require), return original
            if (!(language.clean in Prism.languages)) return rendered;

            // Highlight the code with Prism
            const highlighted = Prism.highlight(inside, Prism.languages[language.clean], language.clean);

            // Combine
            return `${before}${highlighted}${after}`;
        } catch (err) {
            // Fallback to no Prism if render fails
            console.error('Bad Prism render occurred', err);
            return rendered;
        }
    };

    md.renderer.rules.fence = render(md.renderer.rules.fence);
};
