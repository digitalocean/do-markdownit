const md = require("markdown-it")().use(md => {
    md.inline.ruler.push('classAdders', require("./classAdders"));
});

it("handles a class addition", () => {
    expect(md.render("<$>[test]\ntest\n<$>")).toBe('<p><span class="test">test\n</span></p>\n');
})
