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

const { dedupeArray, alwaysArray, regexEscape } = require('./helpers');

it('deduplicates an array while preserving order', () => {
    expect(dedupeArray([ 1, 2, 2, 3, 1 ])).toEqual([ 1, 2, 3 ]);
});

it('wraps a non-array value in an array', () => {
    expect(alwaysArray('x')).toEqual([ 'x' ]);
});

it('returns the same array when already an array', () => {
    const arr = [ 1, 2 ];
    expect(alwaysArray(arr)).toBe(arr);
});

it('escapes special RegExp characters', () => {
    expect(regexEscape('a.b*c?')).toBe('a\\.b\\*c\\?');
    expect(new RegExp(regexEscape('(test)')).test('(test)')).toBe(true);
});
