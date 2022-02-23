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

const md = require('markdown-it')().use(require('./asciinema'));

it('handles asciinema embeds (not inline)', () => {
    expect(md.render('[asciinema 325730]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});

it('handles asciinema embeds with no id (no embed)', () => {
    expect(md.render('[asciinema  ]')).toBe(`<p>[asciinema  ]</p>
`);
});

it('handles asciinema embeds with cols set', () => {
    expect(md.render('[asciinema 325730 100]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="100" data-rows="24"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});

it('handles asciinema embeds with cols and rows set', () => {
    expect(md.render('[asciinema 325730 100 50]')).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="100" data-rows="50"></script>
<noscript>
    <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
</noscript>
`);
});
