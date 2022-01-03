'use strict';

const safeObject = require('../util/safe_object');

module.exports = md => {
  md.block.ruler.before('paragraph', 'glob', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (current line to end)
    const currentLines =  Array.from({ length: endLine - startLine }, (_, i) => {
      const pos = state.bMarks[startLine + i] + state.tShift[startLine + i];
      const max = state.eMarks[startLine + i];
      return state.src.substring(pos, max);
    }).join('\n');

    // Perform some non-regex checks for speed
    if (currentLines.length < 10) return false; // [glob a b]
    if (currentLines.slice(0, 6) !== '[glob ') return false;

    // Look for any double linebreaks (these cannot be inside glob)
    const breakIdx = currentLines.indexOf('\n\n');

    // Attempt to find closing mark (ensure there is a newline at the end if mark is at end of doc)
    const closingMark = (((breakIdx === -1) ? currentLines : currentLines.slice(0, breakIdx)) + '\n').indexOf(']\n');
    if (closingMark === -1) return false;

    // Check for glob match
    const match = currentLines.slice(0, closingMark + 3).match(/^\[glob (.+?(?:(?: .+?)+|(?:\n.+?)+))\](?:$|\n)/);
    if (!match) return false;

    // Get the full strings
    const strings = match[1].split(match[1].includes('\n') ? '\n' : ' ').filter(x => !!x);

    // Get the glob
    const glob = strings[0];
    if (!glob) return false;

    // Get the tests
    const tests = strings.slice(1);
    if (!tests.length) return false;

    // Update the pos for the parser
    state.line = startLine + match[0].trim().split('\n').length;

    // Add token to state
    const token = state.push('glob', 'glob', 0);
    token.block = true;
    token.markup = match[0];
    token.glob = { glob, tests };

    // Track that we need the script
    state.env._glob = safeObject(state.env._glob);
    state.env._glob.tokenized = true;

    // Done
    return true;
  });

  md.renderer.rules.glob = (tokens, index) => {
    const token = tokens[index];

    // Construct the tests attributes
    const tests = token.glob.tests.map((x, i) => `data-glob-test-${i}="${md.utils.escapeHtml(x)}"`).join(' ');

    // Construct the fallback URL
    const url = new URL('https://www.digitalocean.com/community/tools/glob');
    url.searchParams.append('glob', token.glob.glob);
    token.glob.tests.forEach(x => url.searchParams.append('tests', x));

    // Return the HTML
    return `<div data-glob-tool-embed data-glob-string="${md.utils.escapeHtml(token.glob.glob)}" ${tests}>
    <a href="${url.toString()}" target="_blank">
        Explore <code>${md.utils.escapeHtml(token.glob.glob)}</code> as a glob string in our glob testing tool
    </a>
</div>\n`;
  };

  md.core.ruler.push('glob_script', state => {
    // Check if we need to inject the script
    if (state.env._glob && state.env._glob.tokenized && !state.env._glob.injected) {
      // Set that we've injected it
      state.env._glob.injected = true;

      // Inject the token
      const token = new state.Token('html_block', '', 0);
      token.content = `<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>\n`;
      state.tokens.push(token);
    }
  });
};
