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

const findTagOpen = require('./find_tag_open');

it('finds a simple opening tag', () => {
    const html = '<p>hello</p>';
    const pos = findTagOpen('p', html);
    expect(pos).toEqual({ start: 0, end: 3 });
    expect(html.slice(pos.start, pos.end)).toBe('<p>');
});

it('finds a tag with attributes', () => {
    const html = '<div class="x">content</div>';
    const pos = findTagOpen('div', html);
    expect(html.slice(pos.start, pos.end)).toBe('<div class="x">');
});

it('returns null when the tag is not present', () => {
    expect(findTagOpen('span', '<div></div>')).toBeNull();
});

it('ignores greater-than signs inside attribute values', () => {
    const html = '<a title="a > b">link</a>';
    const pos = findTagOpen('a', html);
    expect(html.slice(pos.start, pos.end)).toBe('<a title="a > b">');
});
