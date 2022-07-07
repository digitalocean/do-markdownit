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

const md = require('markdown-it')().use(require('./columns'));

it('handles two columns (not inline)', () => {
    expect(md.render('[column\none\n]\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="column">
<p>one</p>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

it('handles two columns with an extra linebreak between', () => {
    expect(md.render('[column\none\n]\n\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="column">
<p>one</p>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

it('handles a single column (no embed)', () => {
    expect(md.render('[column\none\n]')).toBe(`<p>[column
one
]</p>
`);
});

it('handles two columns with one unclosed (no embed)', () => {
    expect(md.render('[column\none\n]\n[column\ntwo')).toBe(`<p>[column
one
]
[column
two</p>
`);
});

it('handles two columns with an extra multi-line bracket pair inside', () => {
    expect(md.render('[column\none\n[\ntest\n]\n]\n\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="column">
<p>one
[
test
]</p>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

it('handles two columns with an extra single-line bracket pair inside', () => {
    expect(md.render('[column\none\n[test]\n]\n\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="column">
<p>one
[test]</p>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

it('handles two columns with an unclosed bracket pair inside (no embed)', () => {
    expect(md.render('[column\none\n[\ntest\n]\n[column\ntwo\n]')).toBe(`<p>[column
one
[
test
]
[column
two
]</p>
`);
});

it('handles nested columns', () => {
    expect(md.render('[column\none\n\n[column\nnested one\n]\n[column\nnested two\n]\n]\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="column">
<p>one</p>
<div class="columns">
<div class="column">
<p>nested one</p>
</div>
<div class="column">
<p>nested two</p>
</div>
</div>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

it('handles more columns', () => {
    expect(md.render('[column\none\n]\n[column\ntwo\n]\n[column\nthree\n]\n[column\nfour\n]')).toBe(`<div class="columns">
<div class="column">
<p>one</p>
</div>
<div class="column">
<p>two</p>
</div>
<div class="column">
<p>three</p>
</div>
<div class="column">
<p>four</p>
</div>
</div>
`);
});

const mdOuterClass = require('markdown-it')().use(require('./columns'), { outerClassName: 'test' });

it('handles two columns with a custom outer class', () => {
    expect(mdOuterClass.render('[column\none\n]\n\n[column\ntwo\n]')).toBe(`<div class="test">
<div class="column">
<p>one</p>
</div>
<div class="column">
<p>two</p>
</div>
</div>
`);
});

const mdInnerClass = require('markdown-it')().use(require('./columns'), { innerClassName: 'test' });

it('handles two columns with a custom inner class', () => {
    expect(mdInnerClass.render('[column\none\n]\n\n[column\ntwo\n]')).toBe(`<div class="columns">
<div class="test">
<p>one</p>
</div>
<div class="test">
<p>two</p>
</div>
</div>
`);
});

const mdClass = require('markdown-it')().use(require('./columns'), { outerClassName: 'outer', innerClassName: 'inner' });

it('handles two columns with custom inner and outer classes', () => {
    expect(mdClass.render('[column\none\n]\n\n[column\ntwo\n]')).toBe(`<div class="outer">
<div class="inner">
<p>one</p>
</div>
<div class="inner">
<p>two</p>
</div>
</div>
`);
});
