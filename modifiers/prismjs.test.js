const md = require('markdown-it')().use(require('./prismjs'));

it('handles a code fence with a language (adding the class to the pre + highlighting)', () => {
  expect(md.render('```nginx\nserver {\n    try_files test =404;\n}\n```')).toBe(`<pre class="language-nginx drop-tokens"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">try_files</span> test =404</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
`);
});

it('handles a code fence with a language alias', () => {
  expect(md.render('```js\nconsole.log("test");\n```')).toBe(`<pre class="language-javascript drop-tokens"><code class="language-js">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
`);
});

it('does not pollute global scope', () => {
  expect(window).not.toBeUndefined();

  const mdTemp = require('markdown-it')().use(require('./prismjs'));
  mdTemp.render('```js\nconsole.log("test");\n```');

  expect(window.Prism).toBeUndefined();
  expect(global.Prism).toBeUndefined();
});
