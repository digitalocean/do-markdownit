const md = require('markdown-it')().use(require('./rsvp_button'));

it('handles rsvp button embeds (not inline)', () => {
  expect(md.render('[rsvp_button 12345]')).toBe(`<button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">
    RSVP Here
</button>
`);
});

it('handles rsvp button embeds with no id (no embed)', () => {
  expect(md.render('[rsvp_button  ]')).toBe(`<p>[rsvp_button  ]</p>
`);
});

it('handles rsvp button embeds with title set', () => {
  expect(md.render('[rsvp_button 12345 "button title"]')).toBe(`<button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">
    button title
</button>
`);
});

it('handles rsvp button embeds with unclosed title string (no embed)', () => {
  expect(md.render('[rsvp_button 12345 "button title]')).toBe(`<p>[rsvp_button 12345 &quot;button title]</p>
`);
});

it('handles rsvp button embeds with title set containing quotes', () => {
  expect(md.render('[rsvp_button 12345 "button "title""]')).toBe(`<button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">
    button &quot;title&quot;
</button>
`);
});

it('handles rsvp button embeds attempting html injection', () => {
  expect(md.render('[rsvp_button 12345 "<script>alert();</script>"]')).toBe(`<button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">
    &lt;script&gt;alert();&lt;/script&gt;
</button>
`);
});

const mdClass = require('markdown-it')().use(require('./rsvp_button'), { className: 'test' });

it('handles rsvp button embeds with a custom class', () => {
  expect(mdClass.render('[rsvp_button 12345]')).toBe(`<button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="test">
    RSVP Here
</button>
`);
});

