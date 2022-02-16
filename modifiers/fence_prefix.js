'use strict';

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');

/**
 * @typedef {Object} FencePrefixOptions
 * @property {string} [delimiter=','] String to split fence information on.
 */

/**
 * Determine the prefix for a token based on its info, updating the info accordingly.
 *
 * @param {import('markdown-it').Token} token
 * @param {string} delimiter
 * @return {?(function(string, number): string)}
 */
const getPrefix = (token, delimiter) => {
  // Get all flags passed in token
  const flags = new Set(token.info.split(delimiter));

  /**
   * Util to update the token info and classes.
   *
   * @param {string[]} classes Classes to apply to the token, overwriting current.
   * @param {string[]} remove Flags to remove from the token's info.
   * @param {string[]} [add=[]] Flags to add to the token's info.
   */
  const update = (classes, remove, add = []) => {
    remove.forEach(flag => flags.delete(flag));
    add.forEach(flag => flags.add(flag));
    token.info = [ ...flags ].join(delimiter);
    token.attrJoin('class', classes.join(' '));
  };

  // Handle line numbers
  if (flags.has('line_numbers')) {
    update([ 'prefixed', 'line_numbers' ], [ 'line_numbers' ]);
    return (line, idx) => idx + 1;
  }

  // Handle command
  if (flags.has('command')) {
    update([ 'prefixed', 'command' ], [ 'command' ], [ 'bash' ]);
    return () => '$';
  }

  // Handle super user
  if (flags.has('super_user')) {
    update([ 'prefixed', 'super_user' ], [ 'super_user' ], [ 'bash' ]);
    return () => '#';
  }

  // Handle custom
  const custom = [...flags].find(flag => flag.match(/^custom_prefix\((.+)\)$/));
  if (custom) {
    update([ 'prefixed', 'custom_prefix' ], [ custom ], [ 'bash' ]);
    return () => custom.slice(14, -1).replace(/\\s/g, ' ');
  }

  return null;
};

/**
 * Add support for a prefix to be set for each line on a fenced code block.
 *
 * The prefix is set as part of the 'info' provided immediately after the opening fence.
 *
 * The custom prefix can be set by:
 *
 * - Adding the 'line_numbers' flag to the info.
 *   This will set each line's prefix to be incrementing line numbers.
 *
 * - Adding the 'command' flag to the info.
 *   This will set each line's prefix to be a '$' character.
 *   This will also add the 'bash' flag to the info, which can be used for language highlighting.
 *
 * - Adding the 'super_user' flag to the info.
 *   This will set each line's prefix to be a '#' character.
 *   This will also add the 'bash' flag to the info, which can be used for language highlighting.
 *
 * - Adding the 'custom_prefix(<prefix>)' flag to the info.
 *   `<prefix>` can be any string that does not contain spaces. Use `\s` to represent spaces.
 *   This will also add the 'bash' flag to the info, which can be used for language highlighting.
 *
 * @example
 * ```custom_prefix(test)
 * hello
 * world
 * ```
 *
 * <pre><code class="prefixed custom_prefix language-bash"><ol><li data-prefix="test">hello
 * </li><li data-prefix="test">world
 * </li></ol>
 * </code></pre>
 *
 * @type {import('markdown-it').PluginWithOptions<FencePrefixOptions>}
 */
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  /**
   * Wrap the fence render function to detect a prefix and apply it to all lines.
   *
   * @param {import('markdown-it/lib/renderer').RenderRule} original
   * @return {import('markdown-it/lib/renderer').RenderRule}
   */
  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Get the prefix to use
    const prefix = getPrefix(token, options.delimiter || ',');

    // Get the rendered content
    const content = original(tokens, idx, opts, env, self);

    // If no prefix, return normal content
    if (!prefix) return content;

    // Locate the code block start
    const open = findTagOpen('code', content);

    // Locate the code block end
    const close = content.lastIndexOf('\n</code>');

    // Get lines and apply prefix to each
    const lines = content.slice(open.end, close)
      .split('\n')
      .map((line, idx) => `<li data-prefix="${md.utils.escapeHtml(prefix(line, idx))}">${line}\n</li>`)
      .join('');

    // Return the new content
    return `${content.slice(0, open.end)}<ol>${lines}</ol>${content.slice(close)}`;
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
