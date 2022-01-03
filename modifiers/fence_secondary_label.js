'use strict';

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Look for a label at the start of the content
    const match = token.content.match(/^((?:\[.+\]\n)*?)\[secondary_label (.+)\]\n/);
    const name = (match && (match[2] || '').trim()) || null;

    // If no name, just return original
    if (!name) return original(tokens, idx, opts, env, self);

    // Remove the label line
    token.content = token.content.replace(match[0], match[1]);

    // Get the rendered content
    const content = original(tokens, idx, opts, env, self);

    // Locate the code block start
    const open = findTagOpen('code', content);

    // Get the class name to use
    const className = options.className || 'secondary-code-label';

    // Inject label and return
    return `${content.slice(0, open.end)}<div class="${md.utils.escapeHtml(className)}" title="${md.utils.escapeHtml(name)}">${md.utils.escapeHtml(name)}</div>${content.slice(open.end)}`;
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
