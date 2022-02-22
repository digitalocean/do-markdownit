/*
Copyright 2022 DigitalOcean

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

const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'fixtures', 'full-input.md'), 'utf8');
const output = fs.readFileSync(path.join(__dirname, 'fixtures', 'full-output.html'), 'utf8');

it('imports, loads and renders properly', () => {
  // Create a new instance, testing the options the plugins support
  const md = require('markdown-it')({
    langPrefix: '',
    linkify: true,
    typographer: true,
  }).use(require('.'), {
    fence_environment: {
      allowedEnvironments: [ 'local', 'second', 'third', 'fourth', 'fifth' ],
    },
    fence_classes: {
      allowedClasses: [
        'prefixed', 'line_numbers', 'command', 'super_user', 'custom_prefix',
        ...[ 'local', 'second', 'third', 'fourth', 'fifth' ].map(env => `environment-${env}`),
      ],
    },
    callout: {
      allowedClasses: [ 'note', 'warning', 'info', 'draft' ],
    },
  });

  // Render and check output
  const rendered = md.render(input);
  // fs.writeFileSync(path.join(__dirname, 'fixtures', 'full-output.html'), rendered);
  expect(rendered).toBe(output);
});
