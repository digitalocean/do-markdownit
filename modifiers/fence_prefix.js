'use strict';

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');

const getPrefix = (token, deliminator) => {
  // Get all flags passed in token
  const flags = new Set(token.info.split(deliminator));

  // Util to update the token
  const update = (classes, remove, add = []) => {
    remove.forEach(flag => flags.delete(flag));
    add.forEach(flag => flags.add(flag));
    token.info = [ ...flags ].join(deliminator);
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

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Get the prefix to use
    const prefix = getPrefix(token, options.deliminator || ',');

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
