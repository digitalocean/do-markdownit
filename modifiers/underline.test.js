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

const md = require('markdown-it')().use(require('./underline'));

it('handles underline syntax isolated', () => {
    expect(md.renderInline('__test__')).toBe('<u>test</u>');
});

it('handles underline syntax combined with italic', () => {
    expect(md.renderInline('__*test*__')).toBe('<u><em>test</em></u>');
});

it('handles underline syntax combined with bold inside', () => {
    expect(md.renderInline('__**test**__')).toBe('<u><strong>test</strong></u>');
});

it('handles underline syntax combined with bold outside', () => {
    expect(md.renderInline('**__test__**')).toBe('<strong><u>test</u></strong>');
});

it('handles underline syntax combined with bold first & mismatched', () => {
    expect(md.renderInline('**__test**__')).toBe('<strong>__test</strong>__');
});

it('handles underline syntax combined with bold second & mismatched', () => {
    expect(md.renderInline('__**test__**')).toBe('<u>**test</u>**');
});

it('handles underline syntax being mixed with end text', () => {
    expect(md.renderInline('__test__ 123')).toBe('<u>test</u> 123');
});

it('handles underline syntax being mixed with start text', () => {
    expect(md.renderInline('123 __test__')).toBe('123 <u>test</u>');
});
