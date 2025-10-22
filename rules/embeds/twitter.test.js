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

const md = require('markdown-it')().use(require('./twitter'));

it('handles twitter embeds (not inline)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with no link (no embed)', () => {
    expect(md.render('[twitter  ]')).toBe(`<p>[twitter  ]</p>
`);
});

it('handles twitter embeds that are unclosed (no embed)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825')).toBe(`<p>[twitter https://twitter.com/MattIPv4/status/1576415168426573825</p>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825')).toBe(`<p>[twitter https://x.com/MattIPv4/status/1576415168426573825</p>
`);
});

it('handles twitter embeds with http', () => {
    // For twitter.com
    expect(md.render('[twitter http://twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter http://x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with no https:', () => {
    // For twitter.com
    expect(md.render('[twitter //twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter //x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with no https://', () => {
    // For twitter.com
    expect(md.render('[twitter twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with https://www.twitter.com', () => {
    // For twitter.com
    expect(md.render('[twitter https://www.twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://www.x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with www.twitter.com', () => {
    // For twitter.com
    expect(md.render('[twitter www.twitter.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter www.x.com/MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with no domain', () => {
    expect(md.render('[twitter MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with no domain, but a leading slash', () => {
    expect(md.render('[twitter /MattIPv4/status/1576415168426573825]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with a custom width', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 400]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 400]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with a custom width that is too large', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 1000]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 1000]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with a custom width that is too small', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 100]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="250" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 100]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="250" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the light theme', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 light]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 light]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the dark theme', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 dark]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 dark]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the light and dark theme (preferring dark)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 light dark]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 light dark]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the left alignment', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the right alignment', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 right]')).toBe(`<div class="twitter" align="right">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 right]')).toBe(`<div class="twitter" align="right">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the center alignment', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 center]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 center]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the left and right alignment (preferring left)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 right left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 right left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the center and right alignment (preferring center)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 right center]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 right center]')).toBe(`<div class="twitter">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with the left, center and right alignment (preferring left)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 center right left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 center right left]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds with multiple flags combined (dark, left alignment, custom width)', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/MattIPv4/status/1576415168426573825 left dark 400]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/MattIPv4/status/1576415168426573825 left dark 400]')).toBe(`<div class="twitter" align="left">
    <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="dark">
        <a href="https://x.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
    </blockquote>
</div>
<script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>
`);
});

it('handles twitter embeds attempting html injection', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/<script>alert();</script>/status/12345]')).toBe(`<p>[twitter https://twitter.com/&lt;script&gt;alert();&lt;/script&gt;/status/12345]</p>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/<script>alert();</script>/status/12345]')).toBe(`<p>[twitter https://x.com/&lt;script&gt;alert();&lt;/script&gt;/status/12345]</p>
`);
});

it('handles twitter embeds attempting url manipulation', () => {
    // For twitter.com
    expect(md.render('[twitter https://twitter.com/../status/12345]')).toBe(`<p>[twitter https://twitter.com/../status/12345]</p>
`);

    // For x.com
    expect(md.render('[twitter https://x.com/../status/12345]')).toBe(`<p>[twitter https://x.com/../status/12345]</p>
`);
});
