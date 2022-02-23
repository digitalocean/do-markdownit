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

const md = require('markdown-it')().use(require('./highlight'));

it('handles hightlight tags being a sole tag', () => {
    expect(md.renderInline('<^>test<^>')).toBe('<mark>test</mark>');
});

it('handles tags inside hightlight tags', () => {
    expect(md.renderInline('<^>*test*<^>')).toBe('<mark><em>test</em></mark>');
});

it('handles hightlight tags being mixed with end text', () => {
    expect(md.renderInline('<^>test<^> 123')).toBe('<mark>test</mark> 123');
});

it('handles hightlight tags being mixed with start text', () => {
    expect(md.renderInline('123 <^>test<^>')).toBe('123 <mark>test</mark>');
});

it('handles hightlight tags being mixed with start tags', () => {
    expect(md.renderInline('*test* <^>test<^>')).toBe('<em>test</em> <mark>test</mark>');
});

it('handles hightlight tags being mixed with end tags', () => {
    expect(md.renderInline('<^>test<^> *test*')).toBe('<mark>test</mark> <em>test</em>');
});

it('handles hightlight tags being mixed with tags each side', () => {
    expect(md.renderInline('**test** <^>test<^> *test*')).toBe('<strong>test</strong> <mark>test</mark> <em>test</em>');
});

it('handles hightlight tags in code block', () => {
    expect(md.render('```\nhello\nworld\n<^>test<^>\n```')).toBe('<pre><code>hello\nworld\n<mark>test</mark>\n</code></pre>\n');
});

it('handles hightlight tags in code (inline)', () => {
    expect(md.renderInline('`<^>test<^>`')).toBe('<code><mark>test</mark></code>');
});

it('handles hightlight tags in code (not inline)', () => {
    expect(md.render('`<^>test<^>`')).toBe('<p><code><mark>test</mark></code></p>\n');
});
