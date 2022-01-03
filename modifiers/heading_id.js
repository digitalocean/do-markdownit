'use strict';

const safeObject = require('../util/safe_object');

const sluggify = string => string.toLowerCase()
  .replace(/\W+/g, '-')
  .replace(/--+/g, '-')
  .replace(/(^-|-$)/g, '')

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Get the content
    const content = tokens[idx + 1].content;

    // Generate an id if not already set
    if (!token.attrs) token.attrs = [];
    if (token.attrs.every(attr => attr[0] !== 'id')) {
      // Get the slug
      const slug = typeof options.sluggify === 'function' ? options.sluggify(content) : sluggify(content);

      // Add the slug as the id attribute
      token.attrs.push([ 'id', slug ]);

      // Expose the slug in md
      md.headings.push({ slug, content });
    }

    // Render as normal
    return typeof original === 'function'
      ? original(tokens, idx, opts, env, self)
      : self.renderToken(tokens, idx, opts, env);
  };

  md.renderer.rules.heading_open = render(md.renderer.rules.heading_open);

  const reset = original => (...args) => {
    md.headings = [];
    return original.apply(md, args);
  };

  md.render = reset(md.render);
  md.renderInline = reset(md.renderInline);
};
