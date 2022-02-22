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

const md = require('markdown-it')().use(require('./codepen'));

it('handles codepen embeds (not inline)', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with no hash (no embed)', () => {
  expect(md.render('[codepen AlbertFeynman  ]')).toBe(`<p>[codepen AlbertFeynman  ]</p>
`);
});

it('handles codepen embeds with a custom height', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN 512]')).toBe(`<p class="codepen" data-height="512" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 512px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with the lazy flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN lazy]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" data-preview="true" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with the dark theme flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN dark]')).toBe(`<p class="codepen" data-height="256" data-theme-id="dark" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with html tab flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN html]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with css tab flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN css]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="css" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with js tab flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN js]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="js" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with two tab flags (preferring html, then css, then js)', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN css html]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with three tab flags (preferring html, then css, then js)', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN css js html]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with the editable flag', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN editable]')).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" data-editable="true" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});

it('handles codepen embeds with multiple flags combined (lazy, dark, custom height, html tab)', () => {
  expect(md.render('[codepen AlbertFeynman gjpgjN lazy dark 512 html]')).toBe(`<p class="codepen" data-height="512" data-theme-id="dark" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" data-preview="true" style="height: 512px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>
<script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>
`);
});
