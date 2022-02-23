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

const md = require('markdown-it')().use(require('./terminal_button'));

it('handles terminal embeds (not inline)', () => {
    expect(md.render('[terminal ubuntu:focal]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    Launch an Interactive Terminal!
</button>
`);
});

it('handles terminal embeds with no image (no embed)', () => {
    expect(md.render('[terminal  ]')).toBe(`<p>[terminal  ]</p>
`);
});

it('handles terminal embeds with title set', () => {
    expect(md.render('[terminal ubuntu:focal button title]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    button title
</button>
`);
});

it('handles terminal embeds attempting html injection', () => {
    expect(md.render('[terminal ubuntu:focal <script>alert();</script>]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
    &lt;script&gt;alert();&lt;/script&gt;
</button>
`);
});

const mdClass = require('markdown-it')().use(require('./terminal_button'), { className: 'test' });

it('handles terminal embeds with a custom class', () => {
    expect(mdClass.render('[terminal ubuntu:focal]')).toBe(`<button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="test">
    Launch an Interactive Terminal!
</button>
`);
});
