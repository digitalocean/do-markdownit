const md = require('markdown-it')().use(require('./fence_label'));

it('handles a code block with a label', () => {
    expect(md.render('```\n[label test]\nhello\nworld\n```')).toBe(`<div class="code-label" title="test">test</div>
<pre><code>hello
world
</code></pre>
`);
});

it('handles a code block with no label', () => {
    expect(md.render('```\nhello\nworld\n```')).toBe(`<pre><code>hello
world
</code></pre>
`);
});

it('handles a code block with an empty label', () => {
    expect(md.render('```\n[label  ]\nhello\nworld\n```')).toBe(`<pre><code>[label  ]
hello
world
</code></pre>
`);
});

it('handles a code block with a label after other metadata', () => {
    expect(md.render('```\n[other thing]\n[label test]\nhello\nworld\n```')).toBe(`<div class="code-label" title="test">test</div>
<pre><code>[other thing]
hello
world
</code></pre>
`);
});

const mdClass = require('markdown-it')().use(require('./fence_label'), { className: 'test' });

it('handles a code block with a label using a custom class name', () => {
    expect(mdClass.render('```\n[label info]\nhello\nworld\n```')).toBe(`<div class="test" title="info">info</div>
<pre><code>hello
world
</code></pre>
`);
});
