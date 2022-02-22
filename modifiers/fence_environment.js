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
 * @typedef {Object} FenceEnvironmentOptions
 * @property {string[]} [allowedEnvironments] List of case-sensitive environments that are allowed. If not array, all environments are allowed.
 * @property {string} [extraClasses=''] String of extra classes to set when an environment is used.
 */

/**
 * Add support for environment markup at the start of a fence, translating to a class.
 *
 * Markup must be at the start of the fence, though may be preceded by other metadata markup using square brackets.
 *
 * @example
 * ```
 * [environment test]
 * hello
 * world
 * ```
 *
 * <pre><code class="environment-test">hello
 * world
 * </code></pre>
 *
 * @type {import('markdown-it').PluginWithOptions<FenceEnvironmentOptions>}
 */
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  /**
   * Wrap the fence render function to detect environment markup and replace it with the correct class.
   *
   * @param {import('markdown-it/lib/renderer').RenderRule} original
   * @return {import('markdown-it/lib/renderer').RenderRule}
   */
  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Look for an environment at the start of the content
    const match = token.content.match(/^((?:\[.+\]\n)*?)\[environment (.+)\]\n/);
    const name = (match && (match[2] || '').trim()) || null;

    // If no environment, or not allowed, return the original
    if (!name || (options.allowedEnvironments && !options.allowedEnvironments.includes(name)))
      return original(tokens, idx, opts, env, self);

    // Remove the environment line from the content
    token.content = token.content.replace(match[0], match[1]);

    // Add the environment to the classes
    const classes = options.extraClasses ? `${options.extraClasses} environment-${name}` : `environment-${name}`;
    token.attrJoin('class', classes);

    // Render
    return original(tokens, idx, opts, env, self);
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
