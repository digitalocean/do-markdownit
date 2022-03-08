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

const md = require('markdown-it')().use(require('./heading_id'));

it('injects id attributes on headings', () => {
    expect(md.render('# Hello World!')).toBe(`<h1 id="hello-world">Hello World!</h1>
`);
});

it('exposes headings in an object after render', () => {
    md.render('# Hello World!');
    expect(md.headings).toEqual([ {
        slug: 'hello-world',
        content: 'Hello World!',
        text: 'Hello World!',
        rendered: 'Hello World!',
    } ]);
});

it('handles inline markdown inside headings', () => {
    md.render('# Hello **World**!');
    expect(md.headings).toEqual([ {
        slug: 'hello-world',
        content: 'Hello **World**!',
        text: 'Hello World!',
        rendered: 'Hello <strong>World</strong>!',
    } ]);
});

it('resets exposed headings between repeat renders', () => {
    md.render('# Hello World!');
    md.render('# Testing');
    expect(md.headings).toEqual([ {
        slug: 'testing',
        content: 'Testing',
        text: 'Testing',
        rendered: 'Testing',
    } ]);
});

const mdSluggify = require('markdown-it')().use(require('./heading_id'), {
    /**
     * Custom sluggify function, forcing lowercase and only allowing alpha chars.
     *
     * @param {string} str String to be sluggified.
     * @returns {string}
     */
    sluggify: str => str.toLowerCase().replace(/[^a-z]+/g, ''),
});

it('supports a custom sluggify function', () => {
    expect(mdSluggify.render('# Hello World!')).toBe(`<h1 id="helloworld">Hello World!</h1>
`);
});
