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

const md = require('markdown-it')().use(require('./callout'));

it('handles callout embeds (not inline)', () => {
    expect(md.render('<$>[info]\ntest\n<$>')).toBe(`<div class="info">
<p>test</p>
</div>
`);
});

it('handles callout embeds with no linebreaks', () => {
    expect(md.render('<$>[info]test<$>')).toBe(`<div class="info">
<p>test</p>
</div>
`);
});

it('handles callout embeds with multiple linebreaks', () => {
    expect(md.render('<$>[info]\ntest\n\nhello\n\nworld\n<$>')).toBe(`<div class="info">
<p>test</p>
<p>hello</p>
<p>world</p>
</div>
`);
});

it('handles callout embeds with markdown', () => {
    expect(md.render('<$>[info]\ntest **hello** world\n<$>')).toBe(`<div class="info">
<p>test <strong>hello</strong> world</p>
</div>
`);
});

it('handles callout embeds with no linebreaks and markdown', () => {
    expect(md.render('<$>[info]test **hello** world<$>')).toBe(`<div class="info">
<p>test <strong>hello</strong> world</p>
</div>
`);
});

it('handles callout embeds with mixed linebreaks and markdown', () => {
    expect(md.render('<$>[info]test **hello** world\n\nmore *content* tests\n<$>')).toBe(`<div class="info">
<p>test <strong>hello</strong> world</p>
<p>more <em>content</em> tests</p>
</div>
`);
});

it('handles callout embeds with a label', () => {
    expect(md.render('<$>[info]\n[label hello]\n<$>')).toBe(`<div class="info">
<p class="callout-label">hello</p>
</div>
`);
});

it('handles callout embeds with a label and content', () => {
    expect(md.render('<$>[info]\n[label hello]\nworld\n<$>')).toBe(`<div class="info">
<p class="callout-label">hello</p>
<p>world</p>
</div>
`);
});

it('handles callout embeds with a label using markdown', () => {
    expect(md.render('<$>[info]\n[label **hello**]\nworld\n<$>')).toBe(`<div class="info">
<p class="callout-label"><strong>hello</strong></p>
<p>world</p>
</div>
`);
});

const mdAllowed = require('markdown-it')().use(require('./callout'), { allowedClasses: [ 'test' ] });

it('handles callout embeds with an allowed class name', () => {
    expect(mdAllowed.render('<$>[test]\nhello\n<$>')).toBe(`<div class="test">
<p>hello</p>
</div>
`);
});

it('handles callout embeds with a disallowed class name (no embed)', () => {
    expect(mdAllowed.render('<$>[bad]\nhello\n<$>')).toBe(`<p>&lt;$&gt;[bad]
hello
&lt;$&gt;</p>
`);
});

const mdExtra = require('markdown-it')().use(require('./callout'), { extraClasses: [ 'test' ] });

it('handles callout embeds with an extra class name', () => {
    expect(mdExtra.render('<$>[info]\nhello\n<$>')).toBe(`<div class="test info">
<p>hello</p>
</div>
`);
});
