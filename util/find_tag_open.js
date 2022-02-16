'use strict';

/**
 * Find the opening tag for a given tag name.
 *
 * @param {string} tag Name of the tag to find.
 * @param {string} html HTML snippet to search within.
 * @return {?{start: number, end: number}}
 */
module.exports = (tag, html) => {
  // Find the start of the tag
  const start = html.indexOf(`<${tag}`);
  if (start === -1) return null;
  let end = start;

  // Track some temp vars
  const quoteStack = [];
  let backslashes = 0;

  // Walk to find the end of the tag
  for (; end < html.length; end++) {
    // Handle closing
    if (html[end] === '>' && quoteStack.length === 0) break;

    // Handle quote (if closing is inside quotes, we want to ignore)
    if ((html[end] === '"' || html[end] === "'") && backslashes % 2 === 0) {
      if (quoteStack[quoteStack.length - 1] === html[end]) quoteStack.pop();
      else quoteStack.push(html[end]);
      continue;
    }

    // Handle backslash (if quote is escaped by backslash, we want to ignore)
    if (html[end] === '\\') backslashes++;
    else backslashes = 0;
  }

  // Increment end by one to be the next char
  end++;

  // Handle not found
  if (end === html.length) return null;

  // Done
  return { start, end };
};
