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

const md = require('markdown-it')().use(require('./link_attributes'));

it('does not alter links by default', () => {
    expect(md.render('[hello](/world "test")')).toBe(`<p><a href="/world" title="test">hello</a></p>
`);
});

const mdObject = require('markdown-it')({ }).use(require('./link_attributes'), { attributes: { target: '_blank', title: 'other' } });

it('handles an object of attributes', () => {
    expect(mdObject.render('[hello](/world "test")')).toBe(`<p><a href="/world" title="other" target="_blank">hello</a></p>
`);
});

// eslint-disable-next-line jsdoc/require-jsdoc
const mdFunction = require('markdown-it')({ }).use(require('./link_attributes'), { attributes: attrs => ({ ...attrs, target: '_blank', title: 'other' }) });

it('handles a function returning attributes', () => {
    expect(mdFunction.render('[hello](/world "test")')).toBe(`<p><a href="/world" title="other" target="_blank">hello</a></p>
`);
});
