/*
Copyright 2024 DigitalOcean

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

const md = require('markdown-it')().use(require('./collapsible_heading'));

it('does not inject collapsible by default', () => {
    expect(md.render('# H1 header\nTest row')).toBe(`<h1>H1 header</h1>
<p>Test row</p>
`);
});

const mdAllowed = require('markdown-it')({ }).use(require('./collapsible_heading'), { levels: [ 1 ] });

it('only wraps specified headings', () => {
    expect(mdAllowed.render('# H1 header\nTest row\n\n## H2 header\nTest row')).toBe(`<details class="collapsible">
<summary>
<h1>H1 header</h1>
</summary>
<p>Test row</p>
<h2>H2 header</h2>
<p>Test row</p>
</details>
`);
});

const mdUsesClassName = require('markdown-it')({ }).use(require('./collapsible_heading'), { levels: [ 1 ], className: 'test' });

it('uses given classname', () => {
    expect(mdUsesClassName.render('# H1 header\nTest row\n\n## H2 header\nTest row')).toBe(`<details class="test">
<summary>
<h1>H1 header</h1>
</summary>
<p>Test row</p>
<h2>H2 header</h2>
<p>Test row</p>
</details>
`);
});

it('handles same level breaks correctly', () => {
    expect(mdAllowed.render('# H1 header\nTest row\n\n# H1 header\nTest row')).toBe(`<details class="collapsible">
<summary>
<h1>H1 header</h1>
</summary>
<p>Test row</p>
</details>
<details class="collapsible">
<summary>
<h1>H1 header</h1>
</summary>
<p>Test row</p>
</details>
`);
});

const mdAllowedTwo = require('markdown-it')({ }).use(require('./collapsible_heading'), { levels: [ 2 ] });

it('handles different level breaks correctly', () => {
    expect(mdAllowedTwo.render('## H2 header\nTest row\n\n# H1 header\nTest row')).toBe(`<details class="collapsible">
<summary>
<h2>H2 header</h2>
</summary>
<p>Test row</p>
</details>
<h1>H1 header</h1>
<p>Test row</p>
`);
});

const mdDefaultOpen = require('markdown-it')({ }).use(require('./collapsible_heading'), { levels: [ 2 ], open: true });

it('renders the detail open by default', () => {
    expect(mdDefaultOpen.render('## H2 header\nTest row\n\n# H1 header\nTest row')).toBe(`<details class="collapsible" open="">
<summary>
<h2>H2 header</h2>
</summary>
<p>Test row</p>
</details>
<h1>H1 header</h1>
<p>Test row</p>
`);
});
