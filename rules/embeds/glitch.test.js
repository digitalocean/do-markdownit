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

it('handles glitch embeds with multiple flags combined (noattr, custom height, notree, code)', () => {
    expect(md.render('[glitch hello-digitalocean noattr 512 notree code]')).toBe(`<div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?attributionHidden=true&previewSize=0&sidebarCollapsed=true" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
    </iframe>
</div>
`);
});
