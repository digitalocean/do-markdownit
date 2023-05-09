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

const { languages: languagesData } = require('../vendor/prismjs/components');
const { dedupeArray, alwaysArray } = require('./helpers');

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
    if (alias) alwaysArray(alias).forEach(a => { aliases.set(a, lang); });
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

    return dedupeArray([
        alwaysArray(languagesData[lang].require || []),
        optional ? alwaysArray(languagesData[lang].optional || []) : [],
        alwaysArray(languagesData[lang].modify || []),
    ].reduce((acc, deps) => [ ...acc, ...deps.flatMap(dep => getDependencies(dep)), ...deps ], []));
};

module.exports = {
    languages,
    languageAliases,
    getDependencies,
};
