const md = require("markdown-it")().use(md => {
    md.block.ruler.after('fence', 'classAdders', require("./classAdders"));
});

// TODO: Figure out why this isn't working.
it("handles a random class addition", () => {
    expect(md.render("```\n<$>[test]\ntest\n<$>```")).toBe();
})
