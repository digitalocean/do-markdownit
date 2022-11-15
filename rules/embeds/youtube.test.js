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

const md = require('markdown-it')().use(require('./youtube'));

it('handles youtube embeds (not inline)', () => {
    expect(md.render('[youtube iom_nhYQIYk 280 560]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds with no id (no embed)', () => {
    expect(md.render('[youtube  ]')).toBe(`<p>[youtube  ]</p>
`);
});

it('handles youtube embeds that are unclosed (no embed)', () => {
    expect(md.render('[youtube iom_nhYQIYk')).toBe(`<p>[youtube iom_nhYQIYk</p>
`);
});

it('handles youtube embeds without width', () => {
    expect(md.render('[youtube iom_nhYQIYk 240]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="240" width="480" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds without width or height', () => {
    expect(md.render('[youtube iom_nhYQIYk]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds attempting html injection', () => {
    expect(md.render('[youtube <script>alert();</script> 280 560]')).toBe(`<iframe src="https://www.youtube.com/embed/%3Cscript%3Ealert()%3B%3C%2Fscript%3E" class="youtube" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=%3Cscript%3Ealert()%3B%3C%2Fscript%3E" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds attempting url manipulation', () => {
    expect(md.render('[youtube a/../../b 280 560]')).toBe(`<iframe src="https://www.youtube.com/embed/a%2F..%2F..%2Fb" class="youtube" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=a%2F..%2F..%2Fb" target="_blank">View YouTube video</a>
</iframe>
`);
});
