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
 * @module util/prism_util
 */

const regexEscape = require('./regex_escape');
const { languages: languagesData } = require('../vendor/prismjs/components');

/**
 * Deduplicate an array.
 *
 * @param {any[]} arr Array to deduplicate.
 * @returns {any[]}
 * @private
 */
const dedupe = arr => Array.from(new Set(arr));

/**
 * Ensure a value is an array, wrapping it if it is not.
 *
 * @param {any|any[]} val Value to ensure is an array.
 * @returns {any[]}
 * @private
 */
const array = val => (Array.isArray(val) ? val : [ val ]);

/**
 * All languages that Prism supports.
 *
 * @type {Readonly<Set<string>>}
 */
const languages = Object.freeze(new Set(Object.keys(languagesData).filter(lang => lang !== 'meta')));

/**
 * Mapped Prism aliases to their language.
 *
 * @type {Readonly<Map<string, string>>}
 */
const languageAliases = Object.freeze(Object.entries(languagesData).reduce((aliases, [ lang, { alias } ]) => {
    if (alias) array(alias).forEach(a => { aliases.set(a, lang); });
    return aliases;
}, new Map()));

/**
 * Get all language dependencies for a Prism given language.
 *
 * @param {string} lang Prism language name to get dependencies for.
 * @param {boolean} [optional=true] Whether to include optional dependencies.
 * @returns {string[]}
 */
const getDependencies = (lang, optional = true) => {
    if (!languages.has(lang)) throw new Error(`Unknown Prism language: ${lang}`);

    return dedupe([
        array(languagesData[lang].require || []),
        optional ? array(languagesData[lang].optional || []) : [],
        array(languagesData[lang].modify || []),
    ].reduce((acc, deps) => [ ...acc, ...deps.flatMap(dep => getDependencies(dep)), ...deps ], []));
};

/**
 * Plugin to restrict the languages that are bundled for Prism.
 *
 * Automatically resolves and includes all dependencies for the given languages.
 * This plugin requires that Webpack is installed as a dependency with `ContextReplacementPlugin` available.
 *
 * @param {string[]} langs Prism languages to restrict to.
 * @returns {import('webpack').Plugin}
 */
const restrictWebpack = langs => {
    // Webpack is not a dependency, so we only load it here if the user uses this
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { ContextReplacementPlugin } = require('webpack');

    const withDependencies = dedupe(langs.flatMap(lang => [ lang, ...getDependencies(lang) ]));
    return new ContextReplacementPlugin(
        /@digitalocean[/\\]do-markdownit[/\\]vendor[/\\]prismjs[/\\]components$/,
        new RegExp(`prism-(${[ 'core', ...withDependencies.map(dep => regexEscape(dep)) ].join('|')})(\\.js)?$`),
    );
};

module.exports = {
    languages,
    languageAliases,
    getDependencies,
    restrictWebpack,
};
