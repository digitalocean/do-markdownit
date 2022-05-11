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

const md = require('markdown-it')().use(require('./glob'));

it('handles glob embeds (not inline)', () => {
    expect(md.render('[glob *.js /]')).toBe(`<div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});

it('handles glob embeds with no tests (no embed)', () => {
    expect(md.render('[glob *.js]')).toBe(`<p>[glob *.js]</p>
`);
});

it('handles glob embeds that are unclosed (no embed)', () => {
    expect(md.render('[glob *.js /')).toBe(`<p>[glob *.js /</p>
`);
});

it('handles glob embeds with markdown inside', () => {
    expect(md.render('[glob **/**/*.js /]')).toBe(`<div data-glob-tool-embed data-glob-string="**/**/*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=**%2F**%2F*.js&tests=%2F" target="_blank">
        Explore <code>**/**/*.js</code> as a glob string in our glob testing tool
    </a>
</div>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});

it('handles glob embeds with linebreaks', () => {
    expect(md.render('[glob *.js\n/a\n/b]')).toBe(`<div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/a" data-glob-test-1="/b">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2Fa&tests=%2Fb" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});

it('handles glob embeds with linebreaks and spaces in glob', () => {
    expect(md.render('[glob * test.js\n/a\n/b]')).toBe(`<div data-glob-tool-embed data-glob-string="* test.js" data-glob-test-0="/a" data-glob-test-1="/b">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*+test.js&tests=%2Fa&tests=%2Fb" target="_blank">
        Explore <code>* test.js</code> as a glob string in our glob testing tool
    </a>
</div>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});

it('handles glob embeds with multiple linebreaks (no embed)', () => {
    expect(md.render('[glob *.js\n\n/a\n\n/b]')).toBe(`<p>[glob *.js</p>
<p>/a</p>
<p>/b]</p>
`);
});

it('only injects script once with multiple embeds', () => {
    expect(md.render('[glob *.js /]\n\nhello\n\n[glob *.css /]')).toBe(`<div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div>
<p>hello</p>
<div data-glob-tool-embed data-glob-string="*.css" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.css&tests=%2F" target="_blank">
        Explore <code>*.css</code> as a glob string in our glob testing tool
    </a>
</div>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});

it('injects the script at the end of the document', () => {
    expect(md.render('[glob *.js /]\n\nhello')).toBe(`<div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div>
<p>hello</p>
<script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>
`);
});
