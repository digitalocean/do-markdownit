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
 *
 * @typedef {import('markdown-it/lib/token').Token} token
 */

const fs = require('fs');
const path = require('path');

const mdEmpty = require('markdown-it')().use(require('..'), {
    limit_tokens: {
        allowedTokens: [],
        transformTokens: {},
    },
});

it('does not render any tokens by default', () => {
    const input = fs.readFileSync(path.join(__dirname, '../fixtures', 'full-input.md'), 'utf8');
    expect(mdEmpty.render(input)).toBe('');
});

const mdSomeAllowed = require('markdown-it')().use(require('..'), {
    limit_tokens: {
        allowedTokens: [ 'caniuse' ],
        transformTokens: {},
    },
});

it('does render allowed tokens', () => {
    expect(mdSomeAllowed.render('[caniuse css-grid]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
`);
});

const mdTransform = require('markdown-it')().use(require('..'), {
    limit_tokens: {
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
    },
});

it('does render allowed tokens with transformed tokens', () => {
    expect(mdTransform.render('hello world')).toBe('<a>hello world</a>');
});
