/*
Copyright 2023 DigitalOcean

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

const md = require('markdown-it')().use(require('./image_size'));

it('handles an image with alt text and a title', () => {
    expect(md.renderInline('![alt](test.png "title")')).toBe('<img src="test.png" alt="alt" title="title">');
});

it('handles an image with a size (width + height)', () => {
    expect(md.renderInline('![](test.png =100x200)')).toBe('<img src="test.png" alt="" width="100" height="200">');
});

it('handles an image with a size (width only)', () => {
    expect(md.renderInline('![](test.png =100x)')).toBe('<img src="test.png" alt="" width="100">');
});

it('handles an image with a size (height only)', () => {
    expect(md.renderInline('![](test.png =x200)')).toBe('<img src="test.png" alt="" height="200">');
});

it('handles an image with alt text, a title and size', () => {
    expect(md.renderInline('![alt](test.png "title" =100x200)')).toBe('<img src="test.png" alt="alt" title="title" width="100" height="200">');
});

it('handles an image with an invalid size (no x)', () => {
    expect(md.renderInline('![](test.png =100)')).toBe('![](test.png =100)');
});

it('handles an image with an invalid size (bad unit)', () => {
    expect(md.renderInline('![](test.png =10emx20em)')).toBe('![](test.png =10emx20em)');
});
