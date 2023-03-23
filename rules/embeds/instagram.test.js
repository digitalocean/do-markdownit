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

const md = require('markdown-it')().use(require('./instagram'));

it('handles instagram embeds (not inline)', () => {
    expect(md.render('[instagram https://www.instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with no link (no embed)', () => {
    expect(md.render('[instagram  ]')).toBe(`<p>[instagram  ]</p>
`);
});

it('handles instagram embeds that are unclosed (no embed)', () => {
    expect(md.render('[instagram https://www.instagram.com/p/CkQuv3_LRg')).toBe(`<p>[instagram https://www.instagram.com/p/CkQuv3_LRg</p>
`);
});

it('handles instagram embeds with http', () => {
    expect(md.render('[instagram http://instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with no https:', () => {
    expect(md.render('[instagram //instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with no https://', () => {
    expect(md.render('[instagram instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with https://www.instagram.com', () => {
    expect(md.render('[instagram https://www.instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with www.instagram.com', () => {
    expect(md.render('[instagram www.instagram.com/p/CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with only post id', () => {
    expect(md.render('[instagram CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with only post id and a leading slash', () => {
    expect(md.render('[instagram /CkQuv3_LRgS]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with a custom width', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS 400]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" style="width: 400px;" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with a custom width that is too large', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS 1000]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" style="width: 550px;" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with a custom width that is too small', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS 100]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" style="width: 326px;" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the caption flag', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS caption]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14" data-instgrm-captioned>
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the left alignment', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS left]')).toBe(`<div class="instagram" align="left">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the right alignment', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS right]')).toBe(`<div class="instagram" align="right">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the center alignment', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS center]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the left and right alignment (preferring left)', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS right left]')).toBe(`<div class="instagram" align="left">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the center and right alignment (preferring center)', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS right center]')).toBe(`<div class="instagram">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with the left, center and right alignment (preferring left)', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS center right left]')).toBe(`<div class="instagram" align="left">
    <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14">
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds with multiple flags combined (caption, left alignment, custom width)', () => {
    expect(md.render('[instagram https://instagram.com/p/CkQuv3_LRgS caption left 400]')).toBe(`<div class="instagram" align="left">
    <blockquote class="instagram-media" style="width: 400px;" data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS" data-instgrm-version="14" data-instgrm-captioned>
        <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
    </blockquote>
</div>
<script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>
`);
});

it('handles instagram embeds attempting html injection', () => {
    expect(md.render('[instagram https://instagram.com/<script>alert();</script>/12345]')).toBe(`<p>[instagram https://instagram.com/&lt;script&gt;alert();&lt;/script&gt;/12345]</p>
`);
});

it('handles instagram embeds attempting url manipulation', () => {
    expect(md.render('[instagram https://instagram.com/../12345]')).toBe(`<p>[instagram https://instagram.com/../12345]</p>
`);
});
