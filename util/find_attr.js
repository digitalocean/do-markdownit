module.exports = (attr, tag) => {
  // Find where attrs start and end
  let start = tag.indexOf(' ');
  let end = -1;
  const tagEnd = tag.lastIndexOf('>');

  // Track some temp vars
  const quoteStack = [];
  let backslashes = 0;

  // Find the start
  for (; start < tagEnd; start++) {
    // Check we're still viable (can we fit the attr, plus a space before, the equals after, and two quotes)
    if (tagEnd - start < attr.length + 4) return null;

    // Handle a start match
    if (tag.slice(start, start + attr.length + 2) === ` ${attr}=`
      && (tag[start + attr.length + 2] === '"' || tag[start + attr.length + 2] === "'")
      && quoteStack.length === 0) {
      // Reset backslashes to zero, as we know the current char is a space
      backslashes = 0;

      // We want to start exploring the end from after the attr's opening quote
      end = start + attr.length + 3;

      // Attempt to find the end
      for (; end <= tagEnd; end++) {
        // Handle the end
        if (tag[end] === tag[start + attr.length + 2] && quoteStack.length === 0 && backslashes % 2 === 0) break;

        // Handle quote (if closing is inside quotes, we want to ignore)
        if ((tag[end] === '"' || tag[end] === "'") && backslashes % 2 === 0) {
          if (quoteStack[quoteStack.length - 1] === tag[end]) quoteStack.pop();
          else quoteStack.push(tag[end]);
          continue;
        }

        // Handle backslash (if quote is escaped by backslash, we want to ignore)
        if (tag[end] === '\\') backslashes++;
        else backslashes = 0;
      }

      // Increment end by one to be the next char
      end++;

      // We found the end, bam
      if (end <= tagEnd) break;

      // Reset the quote stack (it was empty when we entered this block)
      // and, continue hunting for a valid start
      quoteStack.splice(0, quoteStack.length);
    }

    // Handle quote (if closing is inside quotes, we want to ignore)
    if ((tag[start] === '"' || tag[start] === "'") && backslashes % 2 === 0) {
      if (quoteStack[quoteStack.length - 1] === tag[start]) quoteStack.pop();
      else quoteStack.push(tag[start]);
      continue;
    }

    // Handle backslash (if quote is escaped by backslash, we want to ignore)
    if (tag[start] === '\\') backslashes++;
    else backslashes = 0;
  }

  // Increment start by one to be after the space
  start++;

  return { start, end };
};
