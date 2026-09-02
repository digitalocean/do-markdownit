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

const findBlockEmbed = require('./find_block_embed');

it('finds a simple embed block closing index', () => {
    const lines = [ '[details', 'summary', 'body', ']' ];
    expect(findBlockEmbed(lines, 'details')).toBe(3);
});

it('returns false when there are too few lines', () => {
    expect(findBlockEmbed([ '[details', ']' ], 'details')).toBe(false);
});

it('returns false when the opening type does not match', () => {
    expect(findBlockEmbed([ '[other', 'x', ']' ], 'details')).toBe(false);
});

it('supports an opening line with trailing attributes', () => {
    const lines = [ '[details open', 'title', 'content', ']' ];
    expect(findBlockEmbed(lines, 'details')).toBe(3);
});

it('handles nested bracket pairs inside the block', () => {
    const lines = [ '[details', '[nested', ']', 'done', ']' ];
    expect(findBlockEmbed(lines, 'details')).toBe(4);
});

it('returns false when the closing bracket is missing', () => {
    expect(findBlockEmbed([ '[details', 'a', 'b' ], 'details')).toBe(false);
});
