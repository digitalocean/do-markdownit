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
 * @typedef {Object} UserMentionOptions
 * @property {RegExp} [pattern] A pattern to match user mentions, applied to the string after the `@` symbol.
 * @property {function(string): string} [path] A function to get the URL path for a user mention.
 */

/**
 * Standard function for generating a URL path for a user.
 *
 * @param {string} mention
 * @return {string}
 */
const path = mention => `/users/${mention}`;

/**
 * Add support for mentioning users, using an `@` symbol. Wraps the mention in a link to the user.
 *
 * By default, any characters that are not a space or newline after an `@` symbol will be treated as a mention.
 *
 * @example
 * Hello @test
 *
 * Hello <a href="/users/test">@test</a>
 *
 * @type {import('markdown-it').PluginWithOptions<UserMentionOptions>}
 */
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  /**
   * Parsing rule for user mentions.
   *
   * @type {import('markdown-it/lib/parser_inline').RuleInline}
   */
  const userMentionRule = (state, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Check we're on a mention
    if (state.src[state.pos] !== '@') return false;

    // Look for a space or newline to break the mention, or the end of the state
    const spaceIdx = state.src.indexOf(' ', state.pos + 1);
    const newlineIdx = state.src.indexOf('\n', state.pos + 1);
    let endIdx = Math.min(
      state.posMax,
      spaceIdx === -1 ? state.posMax : spaceIdx,
      newlineIdx === -1 ? state.posMax : newlineIdx,
    );

    // Expect at least one character between the @ and the end
    if (endIdx <= state.pos + 1) return false;

    // Apply pattern if set
    if (typeof options.pattern === 'object' && Object.prototype.toString.call(options.pattern) === '[object RegExp]') {
      // Check if the mention matches the pattern
      const full = state.src.slice(state.pos + 1, endIdx);
      const match = full.match(options.pattern);
      if (!match) return false;

      // Check the match is at the start
      if (full.indexOf(match[0]) !== 0) return false;

      // Adjust the end index
      endIdx = state.pos + 1 + match[0].length;
    }

    // Get the mention
    const mention = state.src.slice(state.pos + 1, endIdx);

    // Get the link
    const link = typeof options.path === 'function'
      ? options.path(mention)
      : path(mention);
    if (!link) return false;

    // Add the start token
    const linkToken = state.push('link_open', 'a', 1);
    linkToken.attrSet('href', link);

    // Add the mention as plain text
    const mentionToken = state.push('text', '', 0);
    mentionToken.content = `@${mention}`;

    // Add the end token
    state.push('link_close', 'a', -1);

    // Move position to the end (not after the end, as we need it to render still)
    state.pos = endIdx;

    // Done
    return true;
  };

  md.inline.ruler.before('link', 'user_mention', userMentionRule);
};
