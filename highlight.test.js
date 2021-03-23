const md = require("markdown-it")().use(md => {
    const highlight = require("./highlight");
    md.inline.ruler.push('highlight', highlight.tokenize);
    md.renderer.rules.fence = highlight.code(md.renderer.rules.fence);
    md.renderer.rules.code_block = highlight.code(md.renderer.rules.code_block);
    md.renderer.rules.code_inline = highlight.code(md.renderer.rules.code_inline);
});

it("handles hightlight tags being a sole tag", () => {
    expect(md.renderInline("<^>test<^>")).toBe("<mark>test</mark>");
});

it("handles tags inside hightlight tags", () => {
    expect(md.renderInline("<^>*test*<^>")).toBe("<mark><em>test</em></mark>");
});

it("handles hightlight tags being mixed with end text", () => {
    expect(md.renderInline("<^>test<^> 123")).toBe("<mark>test</mark> 123");
});

it("handles hightlight tags being mixed with start text", () => {
    expect(md.renderInline("123 <^>test<^>")).toBe("123 <mark>test</mark>");
});

it("handles hightlight tags being mixed with start tags", () => {
    expect(md.renderInline("*test* <^>test<^>")).toBe("<em>test</em> <mark>test</mark>");
});

it("handles hightlight tags being mixed with end tags", () => {
    expect(md.renderInline("<^>test<^> *test*")).toBe("<mark>test</mark> <em>test</em>");
});

it("handles hightlight tags being mixed with tags each side", () => {
    expect(md.renderInline("**test** <^>test<^> *test*")).toBe("<strong>test</strong> <mark>test</mark> <em>test</em>");
});

it("handles hightlight tags in code block", () => {
    expect(md.render("```\nhello\nworld\n<^>test<^>\n```")).toBe("<pre><code>hello\nworld\n<mark>test</mark>\n</code></pre>\n");
});

it("handles hightlight tags in code inline", () => {
    expect(md.renderInline("`<^>test<^>`")).toBe("<code><mark>test</mark></code>");
});
