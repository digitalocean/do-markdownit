const md = require('markdown-it')().use(require('./fence_classes'));

it('does not alter code blocks by default', () => {
    expect(md.render('```test\nhello\nworld\n```')).toBe(`<pre><code class="language-test">hello
world
</code></pre>
`);
});

const mdAllowed = require('markdown-it')({ }).use(require('./fence_classes'), { allowedClasses: [ 'language-test' ] });

it('handles a code block with no class', () => {
    expect(mdAllowed.render('```\nhello\nworld\n```')).toBe(`<pre><code>hello
world
</code></pre>
`);
});

it('handles a code block with an allowed class', () => {
    expect(mdAllowed.render('```test\nhello\nworld\n```')).toBe(`<pre><code class="language-test">hello
world
</code></pre>
`);
});

it('handles a code block with a disallowed class', () => {
  expect(mdAllowed.render('```bad\nhello\nworld\n```')).toBe(`<pre><code class="">hello
world
</code></pre>
`);
});
