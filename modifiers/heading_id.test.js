const md = require('markdown-it')().use(require('./heading_id'));

it('injects id attributes on headings', () => {
  expect(md.render('# Hello World!')).toBe(`<h1 id="hello-world">Hello World!</h1>
`);
});

it('exposes headings in an object after render', () => {
  md.render('# Hello World!');
  expect(md.headings).toEqual([ { slug: 'hello-world', content: 'Hello World!' } ]);
});

it('resets exposed headings between repeat renders', () => {
  md.render('# Hello World!');
  md.render('# Testing');
  expect(md.headings).toEqual([ { slug: 'testing', content: 'Testing' } ]);
});

const mdSluggify = require('markdown-it')().use(require('./heading_id'), { sluggify: str => str.toLowerCase().replace(/[^a-z]+/g, '') });

it('supports a custom sluggify function', () => {
  expect(mdSluggify.render('# Hello World!')).toBe(`<h1 id="helloworld">Hello World!</h1>
`);
});
