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

const md = require('markdown-it')().use(require('./image_settings'));

it('handles an image with alt text and a title', () => {
    expect(md.renderInline('![alt](test.png "title")')).toBe('<img src="test.png" alt="alt" title="title">');
});

it('handles an image with a size (width + height)', () => {
    expect(md.renderInline('![](test.png){ width=100 height=200 }')).toBe('<img src="test.png" alt="" width="100" height="200">');
});

it('handles an image with a size (width + height) with a unit', () => {
    expect(md.renderInline('![](test.png){ width=100px height=200px }')).toBe('<img src="test.png" alt="" width="100px" height="200px">');
});

it('handles an image with a size (width only)', () => {
    expect(md.renderInline('![](test.png){ width=100 }')).toBe('<img src="test.png" alt="" width="100">');
});

it('handles an image with a size (height only)', () => {
    expect(md.renderInline('![](test.png){ height=200 }')).toBe('<img src="test.png" alt="" height="200">');
});

it('handles an image with alt text, a title and size', () => {
    expect(md.renderInline('![alt](test.png "title"){ width=100 height=200 }')).toBe('<img src="test.png" alt="alt" title="title" width="100" height="200">');
});

it('handles an image with an invalid size (no value)', () => {
    expect(md.renderInline('![](test.png){ width= }')).toBe('<img src="test.png" alt="">{ width= }');
});

it('handles an image with an invalid size (bad unit)', () => {
    expect(md.renderInline('![](test.png){ width=10em height=20em }')).toBe('<img src="test.png" alt="">{ width=10em height=20em }');
});

it('handles an image with an alignment', () => {
    expect(md.renderInline('![](test.png){ align=left }')).toBe('<img src="test.png" alt="" align="left">');
});

it('handles an image with an invalid alignment', () => {
    expect(md.renderInline('![](test.png){ align=top }')).toBe('<img src="test.png" alt="">{ align=top }');
});

it('handles an image with a size and alignment', () => {
    expect(md.renderInline('![](test.png){ width=100 height=200 align=left }')).toBe('<img src="test.png" alt="" width="100" height="200" align="left">');
});

it('handles an image with a size and alignment in a different order', () => {
    expect(md.renderInline('![](test.png){ height=200 align=left width=100 }')).toBe('<img src="test.png" alt="" width="100" height="200" align="left">');
});

it('handles an image with an invalid setting', () => {
    expect(md.renderInline('![](test.png){ hello=world }')).toBe('<img src="test.png" alt="">{ hello=world }');
});

it('handles an image with a valid and invalid settings', () => {
    expect(md.renderInline('![](test.png){ width=100 hello=world }')).toBe('<img src="test.png" alt="">{ width=100 hello=world }');
});

const mdNoUnit = require('markdown-it')().use(require('./image_settings'), { sizeUnits: [ '' ] });

it('handles an image with a size (width + height) with no unit, with no units allowed', () => {
    expect(mdNoUnit.renderInline('![](test.png){ width=100 height=200 }')).toBe('<img src="test.png" alt="" width="100" height="200">');
});

it('handles an image with a size (width + height) with a unit, with no units allowed', () => {
    expect(mdNoUnit.renderInline('![](test.png){ width=100px height=200px }')).toBe('<img src="test.png" alt="">{ width=100px height=200px }');
});

const mdCustomUnit = require('markdown-it')().use(require('./image_settings'), { sizeUnits: [ 'em' ] });

it('handles an image with a size (width + height) with no unit, with a custom unit allowed', () => {
    expect(mdCustomUnit.renderInline('![](test.png){ width=100 height=200 }')).toBe('<img src="test.png" alt="">{ width=100 height=200 }');
});

it('handles an image with a size (width + height) with a custom unit, with a custom unit allowed', () => {
    expect(mdCustomUnit.renderInline('![](test.png){ width=100em height=200em }')).toBe('<img src="test.png" alt="" width="100em" height="200em">');
});
