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
 * @module util/prism_webpack
 */

// This isn't listed as a dependency, as only existing Webpack users will use this
// eslint-disable-next-line import/no-extraneous-dependencies
const { ContextReplacementPlugin } = require('webpack');

const { dedupeArray, regexEscape } = require('./helpers');
const { getDependencies } = require('./prism_util');

/**
 * Plugin to restrict the languages that are bundled for Prism.
 *
 * Automatically resolves and includes all dependencies for the given languages.
 * This plugin requires that Webpack is installed as a dependency with `ContextReplacementPlugin` available.
 *
 * @param {string[]} langs Prism languages to restrict to.
 * @returns {import('webpack').Plugin}
 */
module.exports = langs => {
    const withDependencies = dedupeArray(langs.flatMap(lang => [ lang, ...getDependencies(lang) ]));
    return new ContextReplacementPlugin(
        /@digitalocean[/\\]do-markdownit[/\\]vendor[/\\]prismjs[/\\]components$/,
        new RegExp(`prism-(${[ 'core', ...withDependencies.map(dep => regexEscape(dep)) ].join('|')})(\\.js)?$`),
    );
};
