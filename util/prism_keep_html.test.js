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

const Prism = require('../vendor/prismjs');
require('../vendor/prismjs/components/prism-clike')(Prism);
require('../vendor/prismjs/components/prism-javascript')(Prism);
const keepHtml = require('./prism_keep_html');

it('registers the KeepHTML plugin once', () => {
    keepHtml(Prism);
    expect(Prism.plugins.KeepHTML).toBe(true);
    keepHtml(Prism);
    expect(Prism.plugins.KeepHTML).toBe(true);
});

it('preserves existing HTML markup while highlighting', () => {
    keepHtml(Prism);
    const input = 'const <mark>x</mark> = 1;';
    const output = Prism.highlight(input, Prism.languages.javascript, 'javascript');
    expect(output).toContain('<mark>');
    expect(output).toContain('</mark>');
    expect(output).toContain('token');
});
