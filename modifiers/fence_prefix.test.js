const md = require('markdown-it')().use(require('./fence_prefix'));

it('handles the line numbers prefix', () => {
    expect(md.render('```line_numbers\nhello\nworld\n```')).toBe(`<pre><code class="prefixed line_numbers"><ol><li data-prefix="1">hello</li>
<li data-prefix="2">world</li></ol>
</code></pre>
`);
});

it('handles the command prefix', () => {
    expect(md.render('```command\nhello\nworld\n```')).toBe(`<pre><code class="prefixed command language-bash"><ol><li data-prefix="$">hello</li>
<li data-prefix="$">world</li></ol>
</code></pre>
`);
});

it('handles the super_user prefix', () => {
    expect(md.render('```super_user\nhello\nworld\n```')).toBe(`<pre><code class="prefixed super_user language-bash"><ol><li data-prefix="#">hello</li>
<li data-prefix="#">world</li></ol>
</code></pre>
`);
});

it('handles custom prefixes', () => {
    expect(md.render('```custom_prefix(test)\nhello\nworld\n```')).toBe(`<pre><code class="prefixed custom_prefix language-bash"><ol><li data-prefix="test">hello</li>
<li data-prefix="test">world</li></ol>
</code></pre>
`);
});

it('handles the line numbers prefix combined with other classes', () => {
    expect(md.render('```js,line_numbers,test\nhello\nworld\n```')).toBe(`<pre><code class="prefixed line_numbers language-js,test"><ol><li data-prefix="1">hello</li>
<li data-prefix="2">world</li></ol>
</code></pre>
`);
});

it('handles the command prefix combined with other classes', () => {
  expect(md.render('```js,command,test\nhello\nworld\n```')).toBe(`<pre><code class="prefixed command language-js,test,bash"><ol><li data-prefix="$">hello</li>
<li data-prefix="$">world</li></ol>
</code></pre>
`);
});

it('handles the super_user prefix combined with other classes', () => {
  expect(md.render('```js,super_user,test\nhello\nworld\n```')).toBe(`<pre><code class="prefixed super_user language-js,test,bash"><ol><li data-prefix="#">hello</li>
<li data-prefix="#">world</li></ol>
</code></pre>
`);
});
