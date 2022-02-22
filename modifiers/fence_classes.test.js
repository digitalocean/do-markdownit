/*
Copyright 2022 DigitalOcean

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
