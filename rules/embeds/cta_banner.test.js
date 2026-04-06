/*
Copyright 2024 DigitalOcean

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

const md = require('markdown-it')().use(require('./cta_banner'));

it('renders a CTA banner with required props (defaults)', () => {
    expect(md.render('[ctaBanner "Hello" "Get started" "/signup"]')).toBe(
        '<div class="cta-banner" style="background-color: #DFE8FF; --cta-button-color: #C6E3FF; --cta-button-color-hover: #C6E3FF;">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">Hello</h3>\n    </div>\n    <a class="cta-banner-button" href="/signup">Get started</a>\n  </div>\n</div>\n',
    );
});

it('renders with background_color + button_color', () => {
    expect(md.render('[ctaBanner #CAD9FF "Hello" "Get started" "/signup" "#0069FF"]')).toBe(
        '<div class="cta-banner" style="background-color: #CAD9FF; --cta-button-color: #0069FF; --cta-button-color-hover: #0069FF;">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">Hello</h3>\n    </div>\n    <a class="cta-banner-button" href="/signup">Get started</a>\n  </div>\n</div>\n',
    );
});

it('renders with CTA pair only (background defaults)', () => {
    expect(md.render('[ctaBanner "Hello" "Get started" "/signup" "Learn more" "/learn"]')).toBe(
        '<div class="cta-banner" style="background-color: #DFE8FF; --cta-button-color: #C6E3FF; --cta-button-color-hover: #C6E3FF;">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">Hello</h3>\n      <a class="cta-banner-cta" href="/learn">Learn more</a>\n    </div>\n    <a class="cta-banner-button" href="/signup">Get started</a>\n  </div>\n</div>\n',
    );
});

it('renders with background + button_color + CTA pair', () => {
    expect(md.render('[ctaBanner #8AABFF "Hello" "Get started" "/signup" "#1433D6" "Learn more" "/learn"]')).toBe(
        '<div class="cta-banner" style="background-color: #8AABFF; --cta-button-color: #1433D6; --cta-button-color-hover: #1433D6;">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">Hello</h3>\n      <a class="cta-banner-cta" href="/learn">Learn more</a>\n    </div>\n    <a class="cta-banner-button" href="/signup">Get started</a>\n  </div>\n</div>\n',
    );
});

it('escapes title and button_text HTML', () => {
    expect(md.render('[ctaBanner "<script>alert(1)</script>" "Get <b>it</b>" "/signup"]')).toBe(
        '<div class="cta-banner" style="background-color: #DFE8FF; --cta-button-color: #C6E3FF; --cta-button-color-hover: #C6E3FF;">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">&lt;script&gt;alert(1)&lt;/script&gt;</h3>\n    </div>\n    <a class="cta-banner-button" href="/signup">Get &lt;b&gt;it&lt;/b&gt;</a>\n  </div>\n</div>\n',
    );
});

it('falls back to defaults when background_color is invalid', () => {
    const rendered = md.render('[ctaBanner not-a-color "Hello" "Get started" "/signup"]');
    expect(rendered).toContain('style="background-color: #DFE8FF;');
    expect(rendered).not.toContain('not-a-color');
});

it('falls back to defaults when button_color is invalid', () => {
    const rendered = md.render('[ctaBanner #8AABFF "Hello" "Get started" "/signup" "not-a-color"]');
    expect(rendered).toContain('style="background-color: #8AABFF; --cta-button-color: #C6E3FF;');
});

it('does not render when button_link uses an unsupported scheme', () => {
    const rendered = md.render('[ctaBanner "Hello" "Get started" "javascript:alert(1)"]');
    expect(rendered).not.toContain('cta-banner');
    expect(rendered).toContain('[ctaBanner');
});

it('does not render when cta_link uses an unsupported scheme', () => {
    const rendered = md.render('[ctaBanner "Hello" "Get started" "/signup" "Learn more" "javascript:alert(1)"]');
    expect(rendered).not.toContain('cta-banner');
    expect(rendered).toContain('[ctaBanner');
});
