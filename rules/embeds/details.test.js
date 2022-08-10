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

const md = require('markdown-it')().use(require('./details'));

it('handles details (not inline)', () => {
    expect(md.render('[details hello\nworld\n]')).toBe(`<details>
<summary>hello</summary>
<p>world</p>
</details>
`);
});

it('handles details that is unclosed (no embed)', () => {
    expect(md.render('[details hello\nworld')).toBe(`<p>[details hello
world</p>
`);
});

it('handles details with no summary (no embed)', () => {
    expect(md.render('[details\nworld\n]')).toBe(`<p>[details
world
]</p>
`);
});

it('handles details set to be open', () => {
    expect(md.render('[details open hello\nworld\n]')).toBe(`<details open="">
<summary>hello</summary>
<p>world</p>
</details>
`);
});

it('handles details set to be open with no summary (no embed)', () => {
    expect(md.render('[details open\nworld\n]')).toBe(`<p>[details open
world
]</p>
`);
});

it('handles details set to be closed', () => {
    expect(md.render('[details closed hello\nworld\n]')).toBe(`<details>
<summary>hello</summary>
<p>world</p>
</details>
`);
});

it('handles details set to be closed with no summary (no embed)', () => {
    expect(md.render('[details closed\nworld\n]')).toBe(`<p>[details closed
world
]</p>
`);
});

it('handles details with an extra multi-line bracket pair inside', () => {
    expect(md.render('[details hello\nworld\n[\ntest\n]\n]')).toBe(`<details>
<summary>hello</summary>
<p>world
[
test
]</p>
</details>
`);
});

it('handles details with an extra single-line bracket pair inside', () => {
    expect(md.render('[details hello\nworld\n[test]\n]')).toBe(`<details>
<summary>hello</summary>
<p>world
[test]</p>
</details>
`);
});

it('handles details with an extra single-line bracket pair with text after inside', () => {
    expect(md.render('[details hello\nworld\n[test] after\n]')).toBe(`<details>
<summary>hello</summary>
<p>world
[test] after</p>
</details>
`);
});

it('handles details with nested single-line bracket pairs inside', () => {
    expect(md.render('[details hello\nworld\n[test [nested]]\n]')).toBe(`<details>
<summary>hello</summary>
<p>world
[test [nested]]</p>
</details>
`);
});

it('handles details with nested single-line bracket pairs with text after inside', () => {
    expect(md.render('[details hello\nworld\n[test [nested]] after\n]')).toBe(`<details>
<summary>hello</summary>
<p>world
[test [nested]] after</p>
</details>
`);
});

it('handles details with an unclosed bracket pair inside (no embed)', () => {
    expect(md.render('[details hello\nworld\n[\ntest\n]')).toBe(`<p>[details hello
world
[
test
]</p>
`);
});

it('handles details blocks', () => {
    expect(md.render('[details hello\nworld\n\n[details nested hello\nnested world\n]\n]')).toBe(`<details>
<summary>hello</summary>
<p>world</p>
<details>
<summary>nested hello</summary>
<p>nested world</p>
</details>
</details>
`);
});
