'use strict';

const findTagOpen = require('../util/find_tag_open');

/**
 * Move all attributes from the opening `code` tag of a fenced code block to the `pre` tag.
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
  /**
   * Wrap the fence render function to move attributes from `code` to `pre`.
   *
   * @param {import('markdown-it/lib/renderer').RenderRule} original
   * @return {import('markdown-it/lib/renderer').RenderRule}
   */
  const render = original => (tokens, idx, opts, env, self) => {
    // Get the rendered content
    const content = original(tokens, idx, opts, env, self);

    // Locate the pre tag
    const pre = findTagOpen('pre', content);

    // Locate the code tag
    const code = findTagOpen('code', content);

    // Move code attrs to pre
    return `${content.slice(0, pre.start)}<pre${content.slice(pre.start + 4, pre.end - 1)}${content.slice(code.start + 5, code.end - 1)}><code>${content.slice(code.end)}`;
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
