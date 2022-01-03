'use strict';

module.exports = md => {
  md.block.ruler.before('paragraph', 'asciinema', (state, startLine, endLine, silent) => {
    // If silent, don't replace
    if (silent) return false;

    // Get current string to consider (just current line)
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const currentLine = state.src.substring(pos, max);

    // Perform some non-regex checks for speed
    if (currentLine.length < 13) return false; // [asciinema a]
    if (currentLine.slice(0, 11) !== '[asciinema ') return false;
    if (currentLine[currentLine.length - 1] !== ']') return false;

    // Check for asciinema match
    const match = currentLine.match(/^\[asciinema (\d+)(?: (\d+))?(?: (\d+))?\]$/);
    if (!match) return false;

    // Get the id
    const id = Number(match[1]);
    if (!id) return false;

    // Get the columns
    const cols = Number(match[2]) || 80;

    // Get the rows
    const rows = Number(match[3]) || 24;

    // Update the pos for the parser
    state.line = startLine + 1;

    // Add token to state
    const token = state.push('asciinema', 'asciinema', 0);
    token.block = true;
    token.markup = match[0];
    token.asciinema = { id, cols, rows };

    // Done
    return true;
  });

  md.renderer.rules.asciinema = (tokens, index) => {
    const token = tokens[index];

    // Return the HTML
    return `<script src="https://asciinema.org/a/${token.asciinema.id}.js" id="asciicast-${token.asciinema.id}" async data-cols="${token.asciinema.cols}" data-rows="${token.asciinema.rows}"></script>
<noscript>
    <a href="https://asciinema.org/a/${token.asciinema.id}" target="_blank">View asciinema recording</a>
</noscript>\n`;
  };
};
