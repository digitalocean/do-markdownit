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

const md = require('markdown-it')().use(require('./fence_secondary_label'));

it('handles a code block with a secondary label', () => {
    expect(md.render('```\n[secondary_label test]\nhello\nworld\n```')).toBe(`<pre><code><div class="secondary-code-label" title="test">test</div>hello
world
</code></pre>
`);
});

it('handles a code block with no secondary label', () => {
    expect(md.render('```\nhello\nworld\n```')).toBe(`<pre><code>hello
world
</code></pre>
`);
});

it('handles a code block with an empty secondary label', () => {
    expect(md.render('```\n[secondary_label  ]\nhello\nworld\n```')).toBe(`<pre><code>[secondary_label  ]
hello
world
</code></pre>
`);
});

it('handles a code block with a secondary label after other metadata', () => {
    expect(md.render('```\n[other thing]\n[secondary_label test]\nhello\nworld\n```')).toBe(`<pre><code><div class="secondary-code-label" title="test">test</div>[other thing]
hello
world
</code></pre>
`);
});

const mdClass = require('markdown-it')().use(require('./fence_secondary_label'), { className: 'test' });

it('handles a code block with a secondary label using a custom class name', () => {
    expect(mdClass.render('```\n[secondary_label info]\nhello\nworld\n```')).toBe(`<pre><code><div class="test" title="info">info</div>hello
world
</code></pre>
`);
});
