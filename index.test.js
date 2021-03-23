it("imports and loads properly", () => {
    const md = require("markdown-it")().use(require("."));
    md.render("# test\n<$>[test]hello<$>");    
});
