const md = require('markdown-it')().use(require('./terminal'));

it('handles terminal embeds (not inline)', () => {
  expect(md.render('[terminal ubuntu:focal]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    Launch an Interactive Terminal!
</button>
`);
});

it('handles terminal embeds with no image (no embed)', () => {
  expect(md.render('[terminal  ]')).toBe(`<p>[terminal  ]</p>
`);
});

it('handles terminal embeds with title set', () => {
  expect(md.render('[terminal ubuntu:focal button title]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    button title
</button>
`);
});

it('handles terminal embeds attempting html injection', () => {
  expect(md.render('[terminal ubuntu:focal <script>alert();</script>]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    &lt;script&gt;alert();&lt;/script&gt;
</button>
`);
});

const mdClass = require('markdown-it')().use(require('./terminal'), { className: 'test' });

it('handles terminal embeds with a custom class', () => {
  expect(mdClass.render('[terminal ubuntu:focal]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="test">
    Launch an Interactive Terminal!
</button>
`);
});

