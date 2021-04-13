const md = require("markdown-it")().use(md => {
    md.renderer.rules.fence = require("./codeMetadata")(md, md.renderer.rules.fence);
});

it("should support local styling", () => {
    expect(md.render("```\n[environment local]\ntesting 123\n```")).toBe('<pre><code class=\"local-environment\">testing 123\n</code></pre>\n');
});

it("should support second styling", () => {
    expect(md.render("```\n[environment second]\ntesting 123\n```")).toBe('<pre><code class=\"second-environment\">testing 123\n</code></pre>\n');
});

it("should support third styling", () => {
    expect(md.render("```\n[environment third]\ntesting 123\n```")).toBe('<pre><code class=\"third-environment\">testing 123\n</code></pre>\n');
});

it("should support fourth styling", () => {
    expect(md.render("```\n[environment fourth]\ntesting 123\n```")).toBe('<pre><code class=\"fourth-environment\">testing 123\n</code></pre>\n');
});

it("should support fifth styling", () => {
    expect(md.render("```\n[environment fifth]\ntesting 123\n```")).toBe('<pre><code class=\"fifth-environment\">testing 123\n</code></pre>\n');
});

it("should support labels", () => {
    expect(md.render("```\n[label long test testing 123]\ntesting 123\n```")).toBe('<div class="code-label" title="long test testing 123">long test testing 123</div><pre><code>testing 123\n</code></pre>\n');
});

it("should support secondary labels", () => {
    expect(md.render("```\n[secondary_label long test testing 123]\ntesting 123\n```")).toBe('<pre><code><div class="secondary-code-label" title="long test testing 123">long test testing 123</div>\ntesting 123\n</code></pre>\n');
});

it("should support multiple", () => {
    expect(md.render("```\n[secondary_label long test testing 123]\n[environment fifth]\ntesting 123\n```")).toBe('<pre><code class="fifth-environment"><div class="secondary-code-label" title="long test testing 123">long test testing 123</div>\ntesting 123\n</code></pre>\n');
});

it("should not chop a random line", () => {
    expect(md.render("```\ntest\ntesting 123\n```")).toBe('<pre><code>test\ntesting 123\n</code></pre>\n');
});
