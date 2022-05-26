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

const md = require('markdown-it')().use(require('./caniuse'));

it('handles caniuse embeds (not inline)', () => {
    expect(md.render('[caniuse css-grid]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with no feature (no embed)', () => {
    expect(md.render('[caniuse ]')).toBe(`<p>[caniuse ]</p>
`);
});

it('handles caniuse embeds that are unclosed (no embed)', () => {
    expect(md.render('[caniuse css-grid')).toBe(`<p>[caniuse css-grid</p>
`);
});

it('handles caniuse embeds with a past count', () => {
    expect(md.render('[caniuse css-grid past=5]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1,past_2,past_3,past_4,past_5" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with a past count that is zero', () => {
    expect(md.render('[caniuse css-grid past=0]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with a past count that is negative (no embed)', () => {
    expect(md.render('[caniuse css-grid past=-1]')).toBe(`<p>[caniuse css-grid past=-1]</p>
`);
});

it('handles caniuse embeds with a past count that is too large (no embed)', () => {
    expect(md.render('[caniuse css-grid past=10]')).toBe(`<p>[caniuse css-grid past=10]</p>
`);
});

it('handles caniuse embeds with a past count that is not a number (no embed)', () => {
    expect(md.render('[caniuse css-grid past=test]')).toBe(`<p>[caniuse css-grid past=test]</p>
`);
});

it('handles caniuse embeds with a future count', () => {
    expect(md.render('[caniuse css-grid future=3]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_3,future_2,future_1,current,past_1" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with a future count that is zero', () => {
    expect(md.render('[caniuse css-grid future=0]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="current,past_1" data-accessible-colours="false">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with a future count that is negative (no embed)', () => {
    expect(md.render('[caniuse css-grid future=-1]')).toBe(`<p>[caniuse css-grid future=-1]</p>
`);
});

it('handles caniuse embeds with a future count that is too large (no embed)', () => {
    expect(md.render('[caniuse css-grid future=5]')).toBe(`<p>[caniuse css-grid future=5]</p>
`);
});

it('handles caniuse embeds with a future count that is not a number (no embed)', () => {
    expect(md.render('[caniuse css-grid future=test]')).toBe(`<p>[caniuse css-grid future=test]</p>
`);
});

it('handles caniuse embeds with the accessible flag', () => {
    expect(md.render('[caniuse css-grid accessible]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1" data-accessible-colours="true">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});

it('handles caniuse embeds with multiple flags combined (past, accessible, future)', () => {
    expect(md.render('[caniuse css-grid past=2 accessible future=2]')).toBe(`<p class="ciu_embed" data-feature="css-grid" data-periods="future_2,future_1,current,past_1,past_2" data-accessible-colours="true">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
        <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
    </picture>
</p>
<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
`);
});
