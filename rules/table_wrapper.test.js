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

'use strict';

const md = require('markdown-it')().use(require('./table_wrapper'));

it('wraps a table with a `div` with the default `table-wrapper` class', () => {
    expect(md.render('| a |\n|---|')).toBe('<div class="table-wrapper"><table>\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n</table>\n</div>');
});

const mdCustomClass = require('markdown-it')().use(require('./table_wrapper'), { className: 'custom-wrapper-class' });

it('wraps a table with a `div` with `custom-wrapper-class` class', () => {
    expect(mdCustomClass.render('| a |\n|---|')).toBe('<div class="custom-wrapper-class"><table>\n<thead>\n<tr>\n<th>a</th>\n</tr>\n</thead>\n</table>\n</div>');
});
