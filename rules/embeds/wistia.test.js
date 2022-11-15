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

const md = require('markdown-it')().use(require('./wistia'));

it('handles wistia embeds (not inline)', () => {
    expect(md.render('[wistia 7ld71zbvi6 280 560]')).toBe(`<iframe src="https://fast.wistia.net/embed/iframe/7ld71zbvi6" class="wistia" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/7ld71zbvi6" target="_blank">View Wistia video</a>
</iframe>
`);
});

it('handles wistia embeds with no id (no embed)', () => {
    expect(md.render('[wistia  ]')).toBe(`<p>[wistia  ]</p>
`);
});

it('handles wistia embeds that are unclosed (no embed)', () => {
    expect(md.render('[wistia 7ld71zbvi6')).toBe(`<p>[wistia 7ld71zbvi6</p>
`);
});

it('handles wistia embeds without width', () => {
    expect(md.render('[wistia 7ld71zbvi6 240]')).toBe(`<iframe src="https://fast.wistia.net/embed/iframe/7ld71zbvi6" class="wistia" height="240" width="480" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/7ld71zbvi6" target="_blank">View Wistia video</a>
</iframe>
`);
});

it('handles wistia embeds without width or height', () => {
    expect(md.render('[wistia 7ld71zbvi6]')).toBe(`<iframe src="https://fast.wistia.net/embed/iframe/7ld71zbvi6" class="wistia" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/7ld71zbvi6" target="_blank">View Wistia video</a>
</iframe>
`);
});

it('handles wistia embeds attempting html injection', () => {
    expect(md.render('[wistia <script>alert();</script> 280 560]')).toBe(`<iframe src="https://fast.wistia.net/embed/iframe/%3Cscript%3Ealert()%3B%3C%2Fscript%3E" class="wistia" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/%3Cscript%3Ealert()%3B%3C%2Fscript%3E" target="_blank">View Wistia video</a>
</iframe>
`);
});

it('handles wistia embeds attempting url manipulation', () => {
    expect(md.render('[wistia a/../../b 280 560]')).toBe(`<iframe src="https://fast.wistia.net/embed/iframe/a%2F..%2F..%2Fb" class="wistia" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://fast.wistia.net/embed/iframe/a%2F..%2F..%2Fb" target="_blank">View Wistia video</a>
</iframe>
`);
});
