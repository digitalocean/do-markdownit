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

const { languages, languageAliases, getDependencies } = require('./prism_util');

it('exposes a frozen set of Prism languages without meta', () => {
    expect(languages.has('javascript')).toBe(true);
    expect(languages.has('meta')).toBe(false);
    expect(Object.isFrozen(languages)).toBe(true);
});

it('maps known language aliases to their canonical language', () => {
    expect(languageAliases.get('js')).toBe('javascript');
});

it('returns dependencies for a known language', () => {
    const deps = getDependencies('javascript');
    expect(Array.isArray(deps)).toBe(true);
    expect(deps).toContain('clike');
});

it('can omit optional dependencies', () => {
    const withOptional = getDependencies('javascript', true);
    const withoutOptional = getDependencies('javascript', false);
    expect(withoutOptional.length).toBeLessThanOrEqual(withOptional.length);
});

it('throws for an unknown language', () => {
    expect(() => getDependencies('not-a-real-prism-language')).toThrow(/Unknown Prism language/);
});
