'use strict';

const safeObject = require('../util/safe_object');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

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
