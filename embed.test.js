const md = require("markdown-it")().use(md => {
    const embed = require("./embed");
    md.renderer.renderInline = embed(md, null, false, null, md.renderer.renderInline.bind(md.renderer));
    md.renderer.render = embed(md, null, false, null, md.renderer.render.bind(md.renderer));
});

it("handle glob embeds (not inline)", () => {
    expect(md.render("[glob *.js /]")).toBe(`<p><div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div></p>
`);
});

it("handle glob embeds (inline)", () => {
    expect(md.renderInline("[glob *.js /]")).toBe(`<div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
    <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
        Explore <code>*.js</code> as a glob string in our glob testing tool
    </a>
</div>`);
});

it("handles codepen embeds (not inline)", () => {
    expect(md.render("[codepen AlbertFeynman gjpgjN]")).toBe(`<p><p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN"
    style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p></p>
`);
})

it("handles codepen embeds (inline)", () => {
    expect(md.renderInline("[codepen AlbertFeynman gjpgjN]")).toBe(`<p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN"
    style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
</p>`);
})

it("handles dns embeds (not inline)", () => {
    expect(md.render("[dns digitalocean.com]")).toBe(`<p><div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div></p>
`);
});

it("handles dns embeds (not inline, with records)", () => {
    expect(md.render("[dns digitalocean.com MX]")).toBe(`<p><div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="MX">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div></p>
`);});

it("handle dns embeds (inline)", () => {
    expect(md.renderInline("[dns digitalocean.com]")).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>`);
});

it("handles asciinema embeds (not inline)", () => {
    expect(md.render("[asciinema 325730]")).toBe(`<p><script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script><noscript><a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a></noscript></p>
`);
});

it("handles asciinema embeds (inline)", () => {
    expect(md.renderInline("[asciinema 325730]")).toBe(`<script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script><noscript><a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a></noscript>`);
});

// rsvp
