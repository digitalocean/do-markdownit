const md = require('markdown-it')().use(require('./user_mention'));

it('handles a mention', () => {
  expect(md.renderInline('@test')).toBe(`<a href="/users/test">@test</a>`);
});

it('handles a mention with text after (same line)', () => {
  expect(md.renderInline('@test hello')).toBe(`<a href="/users/test">@test</a> hello`);
});

it('handles a mention with text after (new line)', () => {
  expect(md.render('@test\nhello')).toBe(`<p><a href="/users/test">@test</a>
hello</p>
`);
});

it('handles a mention with text after (double new line)', () => {
  expect(md.render('@test\n\nhello')).toBe(`<p><a href="/users/test">@test</a></p>
<p>hello</p>
`);
});

it('handles a mention with text before (same line)', () => {
  expect(md.renderInline('hello @test')).toBe(`hello <a href="/users/test">@test</a>`);
});

it('handles a mention with text before (new line)', () => {
  expect(md.render('hello\n@test')).toBe(`<p>hello
<a href="/users/test">@test</a></p>
`);
});

it('handles a mention with text before (double new line)', () => {
  expect(md.render('hello\n\n@test')).toBe(`<p>hello</p>
<p><a href="/users/test">@test</a></p>
`);
});

const mdPattern = require('markdown-it')().use(require('./user_mention'), { pattern: /[a-z]+/i });

it('handles a mention using a specific pattern', () => {
  expect(mdPattern.render('hello @test, thanks')).toBe(`<p>hello <a href="/users/test">@test</a>, thanks</p>
`);
});

const mdPath = require('markdown-it')().use(require('./user_mention'), { path: mention => `/world/${mention}` });

it('handles a mention using a specific link path', () => {
  expect(mdPath.render('hello @test')).toBe(`<p>hello <a href="/world/test">@test</a></p>
`);
});
