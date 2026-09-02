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

const findAttr = require('./find_attr');

it('finds a double-quoted attribute', () => {
    const tag = '<div class="foo">';
    const pos = findAttr('class', tag);
    expect(pos).toEqual({ start: 5, end: 16 });
    expect(tag.slice(pos.start, pos.end)).toBe('class="foo"');
});

it('finds a single-quoted attribute', () => {
    const tag = '<span id=\'bar\'>';
    const pos = findAttr('id', tag);
    expect(tag.slice(pos.start, pos.end)).toBe('id=\'bar\'');
});

it('returns null when the attribute is missing', () => {
    expect(findAttr('class', '<div id="x">')).toBeNull();
});

it('ignores attribute-like text inside other attribute values', () => {
    const tag = '<div title=" class=nope " class="real">';
    const pos = findAttr('class', tag);
    expect(tag.slice(pos.start, pos.end)).toBe('class="real"');
});
