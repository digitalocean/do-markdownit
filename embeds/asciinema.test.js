const md = require('markdown-it')().use(require('./asciinema'));

it('handles asciinema embeds (not inline)', () => {
  expect(md.render('[asciinema 325730]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});

it('handles asciinema embeds with no id (no embed)', () => {
  expect(md.render('[asciinema  ]')).toBe(`<p>[asciinema  ]</p>
`);
});

it('handles asciinema embeds with cols set', () => {
  expect(md.render('[asciinema 325730 100]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="100" data-rows="24"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});

it('handles asciinema embeds with cols and rows set', () => {
  expect(md.render('[asciinema 325730 100 50]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="100" data-rows="50"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});
