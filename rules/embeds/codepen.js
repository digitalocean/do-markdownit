'use strict';

const safeObject = require('../../util/safe_object');

module.exports = md => {
  md.block.ruler.before('paragraph', 'codepen', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (just current line)
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);

    // Perform some non-regex checks for speed
    if (currentLine.length < 13) return false; // [codepen a b]
    if (currentLine.slice(0, 9) !== '[codepen ') return false;
    if (currentLine[currentLine.length - 1] !== ']') return false;

    // Check for codepen match
    const match = currentLine.match(/^\[codepen (\S+) (\S+)((?: (?:lazy|dark|html|css|js|editable|\d+))*)\]$/);
    if (!match) return false;

    // Get the user
    const user = match[1];
    if (!user) return false;

    // Get the hash
    const hash = match[2];
    if (!hash) return false;

    // Get the raw flags
    const flags = match[3];

    // Get the height
    const heightMatch = flags.match(/\d+/);
    const height = heightMatch ? Number(heightMatch[0]) : 256;

    // Defines the theme
    const theme = flags.includes('dark') ? 'dark' : 'light';

    // Defines if the embed should lazy load
    const lazy = flags.includes('lazy');

    // Defines if the embed should be editable
    const editable = flags.includes('editable');

    // Defines the default tab
    const tab = flags.includes('html')
      ? 'html'
      : (flags.includes('css')
        ? 'css'
        : (flags.includes('js')
          ? 'js'
          : 'result'));

    // Update the pos for the parser
    state.line = startLine + 1;

    // Add token to state
    const token = state.push('codepen', 'codepen', 0);
    token.block = true;
    token.markup = match[0];
    token.codepen = { user, hash, height, theme, lazy, editable, tab };

    // Track that we need the script
    state.env._codepen = safeObject(state.env._codepen);
    state.env._codepen.tokenized = true;

    // Done
    return true;
  });

  md.renderer.rules.codepen = (tokens, index) => {
    const token = tokens[index];

    // Construct the attrs
    const attrHeight = ` data-height="${md.utils.escapeHtml(token.codepen.height)}"`;
    const attrTheme = ` data-theme-id="${md.utils.escapeHtml(token.codepen.theme)}"`;
    const attrTab = ` data-default-tab="${md.utils.escapeHtml(token.codepen.tab)}"`;
    const attrUser = ` data-user="${md.utils.escapeHtml(token.codepen.user)}"`;
    const attrHash = ` data-slug-hash="${md.utils.escapeHtml(token.codepen.hash)}"`;
    const attrLazy = token.codepen.lazy ? ' data-preview="true"' : '';
    const attrEditable = token.codepen.editable ? ' data-editable="true"' : '';

    // Escape some HTML
    const user = md.utils.escapeHtml(token.codepen.user);
    const hash = md.utils.escapeHtml(token.codepen.hash);
    const height = md.utils.escapeHtml(token.codepen.height);

    // Return the HTML
    return `<p class="codepen"${attrHeight}${attrTheme}${attrTab}${attrUser}${attrHash}${attrLazy}${attrEditable} style="height: ${height}px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/${user}/pen/${hash}">${hash} by ${user}</a> (<a href="https://codepen.io/${user}">@${user}</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>\n`;
  };

  md.core.ruler.push('codepen_script', state => {
    // Check if we need to inject the script
    if (state.env._codepen && state.env._codepen.tokenized && !state.env._codepen.injected) {
      // Set that we've injected it
      state.env._codepen.injected = true;

      // Inject the token
      const token = new state.Token('html_block', '', 0);
      token.content = `<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>\n`;
      state.tokens.push(token);
    }
  });
};
