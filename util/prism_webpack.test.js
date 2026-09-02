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

const prismWebpack = require('./prism_webpack');

it('returns a webpack ContextReplacementPlugin for the given languages', () => {
    const plugin = prismWebpack([ 'javascript' ]);
    expect(plugin.constructor.name).toBe('ContextReplacementPlugin');
});

it('includes core and language dependencies in the replacement pattern', () => {
    const plugin = prismWebpack([ 'javascript' ]);
    expect(plugin.newContentRegExp).toBeInstanceOf(RegExp);
    expect(plugin.newContentRegExp.test('prism-core.js')).toBe(true);
    expect(plugin.newContentRegExp.test('prism-javascript.js')).toBe(true);
    expect(plugin.newContentRegExp.test('prism-clike.js')).toBe(true);
    expect(plugin.newContentRegExp.test('prism-markdown.js')).toBe(false);
});
