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

const safeObject = require('./safe_object');

it('clones a plain object', () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = safeObject(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
});

it('returns an empty object for null', () => {
    expect(safeObject(null)).toEqual({});
});

it('returns an empty object for non-objects', () => {
    expect(safeObject('string')).toEqual({});
    expect(safeObject(42)).toEqual({});
    expect(safeObject([ 1, 2 ])).toEqual({});
});

it('does not mutate the original when the clone is changed', () => {
    const original = { nested: { value: 1 } };
    const cloned = safeObject(original);
    cloned.nested.value = 99;
    expect(original.nested.value).toBe(1);
});
