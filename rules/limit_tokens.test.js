/*
Copyright 2023 DigitalOcean

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

/**
 * @typedef {import('markdown-it/lib/token').Token} token
 */

const mdEmpty = require('markdown-it')().use(require('./limit_tokens'), {
    allowedTokens: [],
    transformTokens: {},
});

it('does not render any tokens by default', () => {
    expect(mdEmpty.render('[Hello world](https://test.com)')).toBe('');
});

const mdSomeAllowed = require('markdown-it')().use(require('./limit_tokens'), {
    allowedTokens: [ 'link_open', 'link_close', 'inline', 'text' ],
    transformTokens: {},
});

it('does render allowed tokens', () => {
    expect(mdSomeAllowed.render('[Hello world](https://test.com)')).toBe('<a href="https://test.com">Hello world</a>');
});

it('only renders allowed tokens', () => {
    expect(mdSomeAllowed.render('[Hello world](https://test.com) **this will not be bold** _this will not be italic_'))
        .toBe('<a href="https://test.com">Hello world</a> this will not be bold this will not be italic');
});

const mdTransform = require('markdown-it')().use(require('./limit_tokens'), {
    allowedTokens: [ 'inline', 'text' ],
    transformTokens: {
        /**
         * Function to do the transformation
         *
         * @param {token} token The token to transform.
         * @returns {token}
         *
         */
        paragraph_open: token => new token.constructor(
            'link_open',
            'a',
            token.nesting,
        ),
        /**
         * Function to do the transformation
         *
         * @param {token} token The token to transform.
         * @returns {token}
         *
         */
        paragraph_close: token => new token.constructor(
            'link_close',
            'a',
            token.nesting,
        ),
    },
});

it('does render allowed tokens with transformed tokens', () => {
    expect(mdTransform.render('hello world')).toBe('<a>hello world</a>');
});
