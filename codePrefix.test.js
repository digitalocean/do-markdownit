const md = require("markdown-it")().use(md => {
    md.renderer.rules.fence = require("./codePrefix")(md.renderer.rules.fence);
});

it("handles the command prefix", () => {
    expect(md.render("```command\nhello\nworld\n```")).toBe("<pre><code>$ hello\n$ world\n</code></pre>\n");
});

it("handles the super_user prefix", () => {
    expect(md.render("```super_user\nhello\nworld\n```")).toBe("<pre><code># hello\n# world\n</code></pre>\n");
});

it("handles custom prefixes", () => {
    expect(md.render("```custom_prefix(test)\nhello\nworld\n```")).toBe("<pre><code>test hello\ntest world\n</code></pre>\n");
});
