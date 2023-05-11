/*
Copyright 2023 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const md = require('markdown-it')().use(require('./prismjs'));

it('handles a code fence with a language (adding the class to the pre + highlighting)', () => {
    expect(md.render('```nginx\nserver {\n    try_files test =404;\n}\n```')).toBe(`<pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">try_files</span> test =404</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
`);
});

it('handles a code fence with a language alias', () => {
    expect(md.render('```js\nconsole.log("test");\n```')).toBe(`<pre class="language-javascript"><code class="language-js">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
`);
});

it('does not repeatedly load a modifier component', () => {
    const error = jest.spyOn(global.console, 'error');
    md.render('```ts\nconsole.log("test");\n```\n\n```ts\nconsole.log("test");\n```');
    expect(error).not.toHaveBeenCalledWith(expect.stringContaining('Failed to load Prism component'), 'js-templates', expect.anything());
    error.mockReset();
    error.mockRestore();
});

it('does not pollute global scope', () => {
    global.window = {}; /* global window */
    expect(window).not.toBeUndefined();

    const mdTemp = require('markdown-it')().use(require('./prismjs'));
    mdTemp.render('```js\nconsole.log("test");\n```');

    expect(window.Prism).toBeUndefined();
    expect(global.Prism).toBeUndefined();
});

describe('HTML preservation', () => {
    // This does pollute the tests, no longer isolated, but is needed to inject HTML into the code blocks
    const mdHtml = require('markdown-it')()
        .use(require('../rules/highlight'))
        .use(require('./fence_label'))
        .use(require('./fence_prefix'))
        .use(require('./prismjs'));

    it('handles a token at the start of the code block', () => {
        expect(mdHtml.render('```js\nreturn;\n```')).toBe(`<pre class="language-javascript"><code class="language-js"><span class="token keyword">return</span><span class="token punctuation">;</span>
</code></pre>
`);
    });

    it('handles plain-text at the start of the code block', () => {
        expect(mdHtml.render('```js\nconsole.log;\n```')).toBe(`<pre class="language-javascript"><code class="language-js">console<span class="token punctuation">.</span>log<span class="token punctuation">;</span>
</code></pre>
`);
    });

    it('handles nested tokens in the code block', () => {
        expect(mdHtml.render('```nginx\nserver {}\n```')).toBe(`<pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre>
`);
    });

    it('handles nested markup languages in the code block', () => {
        expect(mdHtml.render('```php\na <?php b\n```')).toBe(`<pre class="language-php"><code class="language-php">a <span class="token php language-php"><span class="token delimiter important">&lt;?php</span> b
</span></code></pre>
`);
    });

    it('handles HTML inside a token in the code block', () => {
        expect(mdHtml.render('```js\nreturn \'hello <^>world<^>\';\n```')).toBe(`<pre class="language-javascript"><code class="language-js"><span class="token keyword">return</span> <span class="token string">&apos;hello <mark>world</mark>&apos;</span><span class="token punctuation">;</span>
</code></pre>
`);
    });

    it('handles HTML inside nested tokens in the code block', () => {
        expect(mdHtml.render('```nginx\nserver { listen 80 <^>default_server<^>; }\n```')).toBe(`<pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span> <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span> <mark>default_server</mark></span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
</code></pre>
`);
    });

    it('handles HTML spanning tokens in the code block', () => {
        expect(mdHtml.render('```nginx\nserver { li<^>sten 80 default_server<^>; }\n```')).toBe(`<pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span> <span class="token directive"><span class="token keyword">li</span><mark><span class="token keyword">sten</span> <span class="token number">80</span> default_server</mark></span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
</code></pre>
`);
    });

    it('handles HTML spanning multi-line tokens in the code block', () => {
        expect(mdHtml.render('```go\n<^>data := `<^>\n  <^>test<^>\n<^>`<^>\n```')).toBe(`<pre class="language-go"><code class="language-go"><mark>data <span class="token operator">:=</span> <span class="token string">\`</span></mark><span class="token string">
  <mark>test</mark>
<mark>\`</mark></span>
</code></pre>
`);
    });

    it('handles HTML outside the code block', () => {
        expect(mdHtml.render('```typescript\n[label test/hello/world.ts]\nconst test: number = 1;\n```')).toBe(`<div class="code-label" title="test/hello/world.ts">test/hello/world.ts</div>
<pre class="language-typescript"><code class="language-typescript"><span class="token keyword">const</span> test<span class="token operator">:</span> <span class="token builtin">number</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
</code></pre>
`);
    });

    it('handles HTML wrapping each line', () => {
        expect(mdHtml.render('```javascript,line_numbers\nconst test = \'hello\';\nconst other = \'world\';\nconsole.log(test, other);\n```')).toBe(`<pre class="language-javascript"><code class="prefixed line_numbers language-javascript"><ol><li data-prefix="1"><span class="token keyword">const</span> test <span class="token operator">=</span> <span class="token string">&apos;hello&apos;</span><span class="token punctuation">;</span>
</li><li data-prefix="2"><span class="token keyword">const</span> other <span class="token operator">=</span> <span class="token string">&apos;world&apos;</span><span class="token punctuation">;</span>
</li><li data-prefix="3">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>test<span class="token punctuation">,</span> other<span class="token punctuation">)</span><span class="token punctuation">;</span>
</li></ol>
</code></pre>
`);
    });
});
