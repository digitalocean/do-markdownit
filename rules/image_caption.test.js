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

const md = require('markdown-it')().use(require('./image_caption'));

it('handles an image with no alt text and no title text (no caption)', () => {
    expect(md.render('![](test.png)')).toBe(`<p><img src="test.png" alt=""></p>
`);
});

it('handles an image with alt text and no title text (no caption)', () => {
    expect(md.render('![alt text](test.png)')).toBe(`<p><img src="test.png" alt="alt text"></p>
`);
});

it('handles an image with no alt text and unclosed title text (no image)', () => {
    expect(md.render('![](test.png "title text)')).toBe(`<p>![](test.png &quot;title text)</p>
`);
});

it('handles an image with alt text and unclosed title text (no image)', () => {
    expect(md.render('![alt text](test.png "title text)')).toBe(`<p>![alt text](test.png &quot;title text)</p>
`);
});

it('handles an image with no alt text but title text, with surrounding text (no caption)', () => {
    expect(md.render('![](test.png "title text") hello')).toBe(`<p><img src="test.png" alt="" title="title text"> hello</p>
`);
});

it('handles an image with no alt text but title text, with text after (no caption)', () => {
    expect(md.render('![](test.png "title text")\nhello')).toBe(`<p><img src="test.png" alt="" title="title text">
hello</p>
`);
});

it('handles an image with no alt text but title text', () => {
    expect(md.render('![](test.png "title text")')).toBe(`<figure><img src="test.png" alt=""><figcaption>title text</figcaption></figure>
`);
});

it('handles an image with alt text and title text', () => {
    expect(md.render('![alt text](test.png "title text")')).toBe(`<figure><img src="test.png" alt="alt text"><figcaption>title text</figcaption></figure>
`);
});

it('handles an image with alt text and title text using Markdown', () => {
    expect(md.render('![alt text](test.png "title text _with Markdown_")')).toBe(`<figure><img src="test.png" alt="alt text"><figcaption>title text <em>with Markdown</em></figcaption></figure>
`);
});
