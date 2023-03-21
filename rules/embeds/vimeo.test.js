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

const md = require('markdown-it')().use(require('./vimeo'));

it('handles vimeo embeds (not inline)', () => {
    expect(md.render('[vimeo https://player.vimeo.com/video/329272793 280 560]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="280" width="560" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds with no id (no embed)', () => {
    expect(md.render('[vimeo  ]')).toBe(`<p>[vimeo  ]</p>
`);
});

it('handles vimeo embeds that are unclosed (no embed)', () => {
    expect(md.render('[vimeo https://player.vimeo.com/video/329272793')).toBe(`<p>[vimeo https://player.vimeo.com/video/329272793</p>
`);
});

it('handles vimeo embeds with http', () => {
    expect(md.render('[vimeo http://player.vimeo.com/video/329272793]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds with no https:', () => {
    expect(md.render('[vimeo //player.vimeo.com/video/329272793]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds with no https://', () => {
    expect(md.render('[vimeo player.vimeo.com/video/329272793]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds with just the video ID', () => {
    expect(md.render('[vimeo 329272793]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds without width', () => {
    expect(md.render('[vimeo https://player.vimeo.com/video/329272793 240]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="240" width="480" style="aspect-ratio: 2/1" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds without width or height', () => {
    expect(md.render('[vimeo https://player.vimeo.com/video/329272793]')).toBe(`<iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
    <a href="https://player.vimeo.com/video/329272793" target="_blank">View Vimeo video</a>
</iframe>
`);
});

it('handles vimeo embeds attempting html injection', () => {
    expect(md.render('[vimeo <script>alert();</script> 280 560]')).toBe(`<p>[vimeo &lt;script&gt;alert();&lt;/script&gt; 280 560]</p>
`);
});

it('handles vimeo embeds attempting url manipulation', () => {
    expect(md.render('[vimeo a/../../b 280 560]')).toBe(`<p>[vimeo a/../../b 280 560]</p>
`);
});
