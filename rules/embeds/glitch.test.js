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

const md = require('markdown-it')().use(require('./glitch'));

it('handles glitch embeds (not inline)', () => {
    expect(md.render('[glitch hello-digitalocean]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with no slug (no embed)', () => {
    expect(md.render('[glitch ]')).toBe(`<p>[glitch ]</p>
`);
});

it('handles glitch embeds that are unclosed (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean')).toBe(`<p>[glitch hello-digitalocean</p>
`);
});

it('handles glitch embeds with a custom height', () => {
    expect(md.render('[glitch hello-digitalocean 512]')).toBe(`<div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with the noattr flag', () => {
    expect(md.render('[glitch hello-digitalocean noattr]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?attributionHidden=true&previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with the code flag', () => {
    expect(md.render('[glitch hello-digitalocean code]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=0" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with the notree flag', () => {
    expect(md.render('[glitch hello-digitalocean notree]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100&sidebarCollapsed=true" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with the path flag', () => {
    expect(md.render('[glitch hello-digitalocean path=src/app.jsx]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100&path=src%2Fapp.jsx" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with an empty path flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean path=]')).toBe(`<p>[glitch hello-digitalocean path=]</p>
`);
});

it('handles glitch embeds with an empty path flag followed by a valid flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean path= code]')).toBe(`<p>[glitch hello-digitalocean path= code]</p>
`);
});

it('handles glitch embeds with the highlights flag using a single value', () => {
    expect(md.render('[glitch hello-digitalocean highlights=15]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100&highlights=15" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with the highlights flag using multiple values', () => {
    expect(md.render('[glitch hello-digitalocean highlights=15,25]')).toBe(`<div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100&highlights=15%2C25" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});

it('handles glitch embeds with an empty highlights flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean highlights=]')).toBe(`<p>[glitch hello-digitalocean highlights=]</p>
`);
});

it('handles glitch embeds with an incomplete highlights flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean highlights=10,]')).toBe(`<p>[glitch hello-digitalocean highlights=10,]</p>
`);
});

it('handles glitch embeds with an empty highlights flag followed by a valid flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean highlights= code]')).toBe(`<p>[glitch hello-digitalocean highlights= code]</p>
`);
});

it('handles glitch embeds with an incomplete highlights flag followed by a valid flag (no embed)', () => {
    expect(md.render('[glitch hello-digitalocean highlights=15, code]')).toBe(`<p>[glitch hello-digitalocean highlights=15, code]</p>
`);
});

it('handles glitch embeds with multiple flags combined (code, custom height, notree, path)', () => {
    expect(md.render('[glitch hello-digitalocean code 512 notree path=src/app.jsx]')).toBe(`<div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=0&sidebarCollapsed=true&path=src%2Fapp.jsx" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});
