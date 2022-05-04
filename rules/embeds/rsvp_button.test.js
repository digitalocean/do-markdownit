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

const md = require('markdown-it')().use(require('./rsvp_button'));

it('handles rsvp button embeds', () => {
    expect(md.render('[rsvp_button 12345]')).toBe(`<p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">RSVP Here</button></p>
`);
});

it('handles rsvp button embeds with no id (no embed)', () => {
    expect(md.render('[rsvp_button  ]')).toBe(`<p>[rsvp_button  ]</p>
`);
});

it('handles rsvp button embeds that are unclosed (no embed)', () => {
    expect(md.render('[rsvp_button 12345')).toBe(`<p>[rsvp_button 12345</p>
`);
});

it('handles rsvp button embeds with title set', () => {
    expect(md.render('[rsvp_button 12345 "button title"]')).toBe(`<p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">button title</button></p>
`);
});

it('handles rsvp button embeds with unclosed title string (no embed)', () => {
    expect(md.render('[rsvp_button 12345 "button title]')).toBe(`<p>[rsvp_button 12345 &quot;button title]</p>
`);
});

it('handles rsvp button embeds with title set containing quotes', () => {
    expect(md.render('[rsvp_button 12345 "button "title""]')).toBe(`<p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">button &quot;title&quot;</button></p>
`);
});

it('handles rsvp button embeds attempting html injection', () => {
    expect(md.render('[rsvp_button 12345 "<script>alert();</script>"]')).toBe(`<p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">&lt;script&gt;alert();&lt;/script&gt;</button></p>
`);
});

it('handles rsvp button embeds with surrounding text', () => {
    expect(md.render('You can join here: [rsvp_button 12345] - 10:00am')).toBe(`<p>You can join here: <button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">RSVP Here</button> - 10:00am</p>
`);
});

it('handles rsvp button embeds inside a table', () => {
    expect(md.render('| Time    | RSVP                |\n|---------|---------------------|\n| 10:00am | [rsvp_button 12345] |')).toBe(`<table>
<thead>
<tr>
<th>Time</th>
<th>RSVP</th>
</tr>
</thead>
<tbody>
<tr>
<td>10:00am</td>
<td><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">RSVP Here</button></td>
</tr>
</tbody>
</table>
`);
});

const mdClass = require('markdown-it')().use(require('./rsvp_button'), { className: 'test' });

it('handles rsvp button embeds with a custom class', () => {
    expect(mdClass.render('[rsvp_button 12345]')).toBe(`<p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="test">RSVP Here</button></p>
`);
});
