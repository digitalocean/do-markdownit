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

const safeObject = require('../../util/safe_object');

/**
 * @typedef {Object} CalloutOptions
 * @property {string[]} [allowedClasses] List of case-sensitive classes that are allowed. If not array, all classes are allowed.
 * @property {string[]} [extraClasses=[]] List of extra classes to apply to a callout div, alongside the given class.
 * @property {string} [labelClass='callout-label'] Class to use for the label.
 */

/**
 * Add support for callout embeds in Markdown, as block syntax.
 *
 * The basic syntax is `<$>[<class>]<text><$>`. E.g. `<$>[hello]world<$>`.
 * The class must be in square brackets, and must come immediately after the opening `<$>`.
 * Newlines are allowed in the text, as is any other Markdown syntax (both block and inline).
 *
 * Callouts can also have a label set within them. The label should be in the format `[label <text>]`.
 * The label must be on the first newline after the opening `<$>`.
 * The label cannot contain any newlines, but does support inline Markdown syntax.
 *
 * @example
 * <$>[info]
 * test
 * <$>
 *
 * <div class="info">
 * <p>test</p>
 * </div>
 *
 * @example
 * <$>[info]
 * [label hello]
 * world
 * <$>
 *
 * <div class="info">
 * <p class="callout-label">hello</p>
 * <p>world</p>
 * </div>
 *
 * @type {import('markdown-it').PluginWithOptions<CalloutOptions>}
 */
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  /**
   * Parsing rule for callout markup.
   *
   * @type {import('markdown-it/lib/parser_block').RuleBlock}
   */
  const calloutRule = (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (current line to end)
    const currentLines = Array.from({ length: endLine - startLine }, (_, i) => {
      const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
      const max = state.eMarks[startLine + i];
      return state.src.substring(pos, max);
    }).join('\n');

    // Perform some non-regex checks for speed
    if (currentLines.length < 10) return false; // <$>[a]b<$>
    if (currentLines.slice(0, 4) !== '<$>[') return false;

    // Attempt to find closing mark (ensure there is a newline at the end if mark is at end of doc)
    const closingMark = (currentLines + '\n').indexOf('<$>\n');
    if (closingMark === -1) return false;

    // Check for callout match
    const match = currentLines.slice(0, closingMark + 4).match(/^<\$>\[([^\[\]\n]+)]([\s\S]+?)\n?<\$>(?:$|\n)/);
    if (!match) return false;

    // Get the class name
    const className = match[1].trim();
    if (!className) return false;

    // Check class name is allowed
    if (options.allowedClasses && !options.allowedClasses.includes(className)) return false;

    // Set the parent type
    const oldParentType = state.parentType;
    state.parentType = 'callout';

    // Update the pos for the parser
    state.line = startLine + match[0].trim().split('\n').length;

    // Add opening token to state
    const tokenOpen = state.push('callout_open', 'div', 1);
    tokenOpen.block = true;
    tokenOpen.markup = `<$>[${match[1]}]`;
    tokenOpen.callout = { className };
    tokenOpen.map = [ startLine, state.line ];

    // Update the boundaries based on the markup
    state.bMarks[startLine] += `<$>[${match[1]}]`.length;
    state.eMarks[state.line - 1] -= '<$>'.length;

    // Check for a label
    const labelMatch = match[2].match(/^\n\[label ([^\n]+)](?:$|\n)/);
    if (labelMatch) {
      // Add opening token to state
      const labelOpenToken = state.push('callout_label_open', 'p', 1);
      labelOpenToken.block = true;
      labelOpenToken.markup = `[label `;
      labelOpenToken.map = [ startLine + 1, startLine + 2 ];

      // Create an inline token for the content
      const labelToken = state.push('inline', '', 0);
      labelToken.content = labelMatch[1];
      labelToken.map = [ startLine + 1, startLine + 2 ];
      labelToken.children = [];

      // Add closing token to state
      const labelCloseToken = state.push('callout_label_close', 'p', -1);
      labelCloseToken.block = true;
      labelCloseToken.markup = ']';

      // Change the start line
      startLine += 2;
    }

    // Add content to state
    state.md.block.tokenize(state, startLine, state.line);

    // Add closing token to state
    const tokenClose = state.push('callout_close', 'div', -1);
    tokenClose.block = true;
    tokenClose.markup = '<$>';

    // Reset parent type
    state.parentType = oldParentType;

    // Done
    return true;
  };

  md.block.ruler.before('paragraph', 'callout', calloutRule);

  /**
   * Rendering rule for the start of a callout.
   *
   * @type {import('markdown-it/lib/renderer').RenderRule}
   */
  md.renderer.rules.callout_open = (tokens, index) => {
    const token = tokens[index];
    const classes = options.extraClasses
      ? `${options.extraClasses} ${token.callout.className}`
      : `${token.callout.className}`;
    return `<div class="${md.utils.escapeHtml(classes)}">\n`;
  };

  /**
   * Rendering rule for the end of a callout.
   *
   * @type {import('markdown-it/lib/renderer').RenderRule}
   */
  md.renderer.rules.callout_close = () => {
    return '</div>\n';
  };

  /**
   * Rendering rule for the start of a callout label inside a callout.
   *
   * @type {import('markdown-it/lib/renderer').RenderRule}
   */
  md.renderer.rules.callout_label_open = () => {
    return `<p class="${md.utils.escapeHtml(options.labelClass || 'callout-label')}">`;
  };

  /**
   * Rendering rule for the end of a callout label inside a callout.
   *
   * @type {import('markdown-it/lib/renderer').RenderRule}
   */
  md.renderer.rules.callout_label_close = () => {
    return '</p>\n';
  };
};
