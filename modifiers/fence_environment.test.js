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

'use strict';

const md = require('markdown-it')().use(require('./fence_environment'));

it('handles a code block environment', () => {
    expect(md.render('```\n[environment test]\nhello\nworld\n```')).toBe(`<pre><code class="environment-test">hello
world
</code></pre>
`);
});

it('handles a code block with no environment', () => {
    expect(md.render('```\nhello\nworld\n```')).toBe(`<pre><code>hello
world
</code></pre>
`);
});

it('handles a code block with an empty environment', () => {
    expect(md.render('```\n[environment  ]\nhello\nworld\n```')).toBe(`<pre><code>[environment  ]
hello
world
</code></pre>
`);
});

it('handles a code block with an environment after other metadata', () => {
    expect(md.render('```\n[other thing]\n[environment test]\nhello\nworld\n```')).toBe(`<pre><code class="environment-test">[other thing]
hello
world
</code></pre>
`);
});

const mdAllowed = require('markdown-it')().use(require('./fence_environment'), { allowedEnvironments: [ 'test' ] });

it('handles a code block with an allowed environment', () => {
    expect(mdAllowed.render('```\n[environment test]\nhello\nworld\n```')).toBe(`<pre><code class="environment-test">hello
world
</code></pre>
`);
});

it('handles a code block with a disallowed environment', () => {
    expect(mdAllowed.render('```\n[environment bad]\nhello\nworld\n```')).toBe(`<pre><code>[environment bad]
hello
world
</code></pre>
`);
});

const mdExtra = require('markdown-it')().use(require('./fence_environment'), { extraClasses: [ 'test' ] });

it('handles callout embeds with an extra class name', () => {
    expect(mdExtra.render('```\n[environment info]\nhello\nworld\n```')).toBe(`<pre><code class="test environment-info">hello
world
</code></pre>
`);
});
