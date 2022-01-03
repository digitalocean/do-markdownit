'use strict';

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');
const findAttr = require('../util/find_attr');

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const filterTag = (tagName, content) => {
    // Locate the tag
    const tagPos = findTagOpen(tagName, content);
    if (!tagPos) return content;

    // Locate the class attribute
    const tag = content.slice(tagPos.start, tagPos.end);
    const classPos = findAttr('class', tag);
    if (!classPos) return content;

    // Extract the class attribute
    const classes = tag.slice(classPos.start + 7, classPos.end - 1).split(' ');
    const permitted = classes.filter(cls => options.allowedClasses.includes(cls));

    // Generate the new tag
    const newTag = `${tag.slice(0, classPos.start + 7)}${permitted.join(' ')}${tag.slice(classPos.end - 1)}`;

    // Return the content with the new tag
    return `${content.slice(0, tagPos.start)}${newTag}${content.slice(tagPos.end)}`;
  };

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the rendered content
    const content = original(tokens, idx, opts, env, self);

    // If no permitted classes, return the original content
    if (!Array.isArray(options.allowedClasses)) return content;

    // Filter the pre and code tags if present
    return filterTag('code', filterTag('pre', content));
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
