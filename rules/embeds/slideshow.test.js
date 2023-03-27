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

const md = require('markdown-it')().use(require('./slideshow'));

it('handles slideshow embeds (not inline)', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png 400 400]')).toBe(`<div class="slideshow" style="height: 400px; width: 400px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 400)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 400)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds with no urls (no embed)', () => {
    expect(md.render('[slideshow  ]')).toBe(`<p>[slideshow  ]</p>
`);
});

it('handles slideshow embeds that are unclosed (no embed)', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png')).toBe(`<p>[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png</p>
`);
});

it('handles slideshow embeds with one url', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png]')).toBe(`<div class="slideshow" style="height: 270px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /></div>
</div>
`);
});

it('handles slideshow embeds without width or height', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png]')).toBe(`<div class="slideshow" style="height: 270px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds without width', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png 400]')).toBe(`<div class="slideshow" style="height: 400px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds with height and width in random places', () => {
    expect(md.render('[slideshow 400 https://assets.digitalocean.com/banners/python.png 500 https://assets.digitalocean.com/banners/javascript.png]')).toBe(`<div class="slideshow" style="height: 400px; width: 500px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 500)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 500)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds with height anywhere in the options', () => {
    expect(md.render('[slideshow https://assets.digitalocean.com/banners/python.png 400 https://assets.digitalocean.com/banners/javascript.png]')).toBe(`<div class="slideshow" style="height: 400px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds attempting html injection', () => {
    expect(md.render('[slideshow <script>alert();</script>]')).toBe(`<div class="slideshow" style="height: 270px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="&lt;script&gt;alert();&lt;/script&gt;" alt="Slide #1" /></div>
</div>
`);
});

it('handles slideshow embeds attempting js injection', () => {
    expect(md.render('[slideshow " onload="alert();]')).toBe(`<div class="slideshow" style="height: 270px; width: 480px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
<div class="slides"><img src="&quot;" alt="Slide #1" /><img src="onload=&quot;alert();" alt="Slide #2" /></div>
</div>
`);
});

it('handles slideshow embeds attempting url manipulation', () => {
    expect(md.render('[slideshow a/../../b a/../../b 280 560]')).toBe(`<div class="slideshow" style="height: 280px; width: 560px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 560)()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 560)()">&#8250;</div>
<div class="slides"><img src="a/../../b" alt="Slide #1" /><img src="a/../../b" alt="Slide #2" /></div>
</div>
`);
});
