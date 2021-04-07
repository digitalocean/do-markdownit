it("imports and loads properly", () => {
    const md = require("markdown-it")().use(require("."));
    expect(md.render("# test\n<$>[test]`<^>hello<^>`<$>")).toBe('<h1>test</h1>\n<p><span class="test"><code><mark>hello</mark></code></span></p>\n');
});
