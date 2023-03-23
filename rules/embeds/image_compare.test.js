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

const md = require('markdown-it')().use(require('./image_compare'));

it('handles image compare embeds (not inline)', () => {
    expect(md.render('[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg 400 400]')).toBe(`<div class="imageCompare" style="--value:50%; height: 400px; width: 400px;">
    <img class="image-left" src="https://rb.gy/jykhuo" alt="Image left"/>
    <img class="image-right" src="https://rb.gy/zt5afg" alt="Image right"/>
    <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', \`\${this.value}%\`)" />
    <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
</div>
`);
});

it('handles image compare embeds with no urls (no embed)', () => {
    expect(md.render('[image_compare  ]')).toBe(`<p>[image_compare  ]</p>
`);
});

it('handles image compare embeds that are unclosed (no embed)', () => {
    expect(md.render('[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg')).toBe(`<p>[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg</p>
`);
});

it('handles image compare embeds without width', () => {
    expect(md.render('[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg 400]')).toBe(`<div class="imageCompare" style="--value:50%; height: 400px; width: 500px;">
    <img class="image-left" src="https://rb.gy/jykhuo" alt="Image left"/>
    <img class="image-right" src="https://rb.gy/zt5afg" alt="Image right"/>
    <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', \`\${this.value}%\`)" />
    <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
</div>
`);
});

it('handles image compare embeds without width or height', () => {
    expect(md.render('[image_compare https://rb.gy/jykhuo https://rb.gy/zt5afg]')).toBe(`<div class="imageCompare" style="--value:50%; height: 500px; width: 500px;">
    <img class="image-left" src="https://rb.gy/jykhuo" alt="Image left"/>
    <img class="image-right" src="https://rb.gy/zt5afg" alt="Image right"/>
    <input type="range" class="control" min="0" max="100" value="50" oninput="this.parentNode.style.setProperty('--value', \`\${this.value}%\`)" />
    <svg class="control-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504.3 273.6c4.9-4.5 7.7-10.9 7.7-17.6s-2.8-13-7.7-17.6l-112-104c-7-6.5-17.2-8.2-25.9-4.4s-14.4 12.5-14.4 22l0 56-192 0 0-56c0-9.5-5.7-18.2-14.4-22s-18.9-2.1-25.9 4.4l-112 104C2.8 243 0 249.3 0 256s2.8 13 7.7 17.6l112 104c7 6.5 17.2 8.2 25.9 4.4s14.4-12.5 14.4-22l0-56 192 0 0 56c0 9.5 5.7 18.2 14.4 22s18.9 2.1 25.9-4.4l112-104z"/></svg>
</div>
`);
});

it('handles image compare embeds attempting html injection', () => {
    expect(md.render('[image_compare <script>alert();</script>]')).toBe(`<p>[image_compare &lt;script&gt;alert();&lt;/script&gt;]</p>
`);
});

it('handles vimeo embeds attempting url manipulation', () => {
    expect(md.render('[vimeo a/../../b 280 560]')).toBe(`<p>[vimeo a/../../b 280 560]</p>
`);
});
