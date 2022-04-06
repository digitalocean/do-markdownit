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

const md = require('markdown-it')().use(require('./user_mention'));

it('handles a mention', () => {
    expect(md.renderInline('@test')).toBe('<a href="/users/test">@test</a>');
});

it('handles a mention with text after (same line)', () => {
    expect(md.renderInline('@test hello')).toBe('<a href="/users/test">@test</a> hello');
});

it('handles a mention with text after (new line)', () => {
    expect(md.render('@test\nhello')).toBe(`<p><a href="/users/test">@test</a>
hello</p>
`);
});

it('handles a mention with text after (double new line)', () => {
    expect(md.render('@test\n\nhello')).toBe(`<p><a href="/users/test">@test</a></p>
<p>hello</p>
`);
});

it('handles a mention with text before (same line)', () => {
    expect(md.renderInline('hello @test')).toBe('hello <a href="/users/test">@test</a>');
});

it('handles a mention with text before (new line)', () => {
    expect(md.render('hello\n@test')).toBe(`<p>hello
<a href="/users/test">@test</a></p>
`);
});

it('handles a mention with text before (double new line)', () => {
    expect(md.render('hello\n\n@test')).toBe(`<p>hello</p>
<p><a href="/users/test">@test</a></p>
`);
});

it('does not inject mentions inside links', () => {
    expect(md.render('[test@test](https://test.com)')).toBe(`<p><a href="https://test.com">test@test</a></p>
`);
});

const mdPattern = require('markdown-it')().use(require('./user_mention'), { pattern: /[a-z]+/i });

it('handles a mention using a specific pattern', () => {
    expect(mdPattern.render('hello @test, thanks')).toBe(`<p>hello <a href="/users/test">@test</a>, thanks</p>
`);
});

const mdPath = require('markdown-it')().use(require('./user_mention'), {
    /**
     * Custom path function, prepending the world subdirectory to the mention.
     *
     * @param {string} mention User mention to generate a URL path for.
     * @returns {string}
     */
    path: mention => `/world/${mention}`,
});

it('handles a mention using a specific link path', () => {
    expect(mdPath.render('hello @test')).toBe(`<p>hello <a href="/world/test">@test</a></p>
`);
});
