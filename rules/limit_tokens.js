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
 * @module rules/limit_tokens
 */

/**
 * @typedef {import('markdown-it/lib/token').Token} Token
 */

const safeObject = require('../util/safe_object');

/**
 * @typedef {Object} LimitTokensOptions
 * @property {Token.type[]} [allowedTokens] List of MD tokens allowed to render.
 * @property {Object<string, function(Token): Token>} [transformTokens] List of MD tokens to transform into something else.
 */

/**
 * Filters and transforms tokens in the token stream.
 *
 * @type {import('markdown-it').PluginWithOptions<LimitTokensOptions>}
 */
module.exports = (md, options) => {
    // Get the correct options
    const optsObj = safeObject(options);

    /**
     * Helper function that does the actual filtering/transforming of tokens.
     *
     * @param {Token[]} tokens The list of tokens to be filtered/transformed.
     * @returns {Token[]}
     * @private
     */
    const doFiltering = tokens => tokens.reduce((newStream, token) => {
        let newToken;
        // Check if the current token is in the allowed list
        if (optsObj.allowedTokens.includes(token.type)) newToken = token;

        // Check if the current token is in the transformation list
        if (Object.prototype.hasOwnProperty.call(optsObj.transformTokens, token.type)) {
            newToken = optsObj.transformTokens[token.type](token);
        }

        if (newToken) {
            if (token.children) newToken.children = doFiltering(token.children);
            newStream.push(newToken);
        }

        return newStream;
    }, []);

    /**
     * Rule for filtering and transforming tokens in the token stream.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const limitTokens = state => {
        state.tokens = doFiltering(state.tokens);
    };

    md.core.ruler.push('limit_tokens', limitTokens);
};
