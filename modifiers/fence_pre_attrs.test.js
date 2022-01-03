const md = require('markdown-it')().use(require('./fence_pre_attrs'));

it('handles a code block and moves language to pre', () => {
  expect(md.render('```js\nhello\nworld\n```')).toBe(`<pre class="language-js"><code>hello
world
</code></pre>
`);
});
