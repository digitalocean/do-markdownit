const md = require('markdown-it')().use(require('./html_comment'));
const mdStrict = require('markdown-it')().use(require('./html_comment'), { strict: true });

it('handles a full comment inline with other text', () => {
    expect(md.renderInline('a <!-- b --> c')).toBe('a  c');
});

it('handles an unclosed comment inline with other text', () => {
    expect(md.renderInline('a <!-- b c')).toBe('a ');
});

it('ignores an unclosed comment if in strict mode', () => {
    expect(mdStrict.renderInline('a <!-- b c')).toBe('a &lt;!-- b c');
});

it('handles comment boundaries correctly', () => {
    expect(md.renderInline('a<!--b-->c')).toBe('ac');
});

it('ignores a comment inside a inline code', () => {
    expect(md.renderInline('a `<!-- b -->` c')).toBe('a <code>&lt;!-- b --&gt;</code> c');
});

it('handles a full comment block', () => {
    expect(md.render('a\n\n<!-- b\nc -->\n\nd')).toBe(`<p>a</p>
<p>d</p>
`);
});

it('handles an unclosed comment block', () => {
    expect(md.render('a\n\n<!-- b\nc')).toBe(`<p>a</p>
`);
});

it('ignores an unclosed comment block if in strict mode', () => {
    expect(mdStrict.render('a\n\n<!-- b\nc')).toBe(`<p>a</p>
<p>&lt;!-- b
c</p>
`);
});

it('handles a full comment block with text immediately after', () => {
    expect(md.render('a\n\n<!-- b\nc -->\nd')).toBe(`<p>a</p>
<p>d</p>
`);
});

it('ignores a comment inside a code block', () => {
    expect(md.render('a\n\n```\n<!-- b -->\n```\n\nc')).toBe(`<p>a</p>
<pre><code>&lt;!-- b --&gt;\n</code></pre>
<p>c</p>
`);
});
