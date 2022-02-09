const md = require('markdown-it')().use(require('./youtube'));

it('handles youtube embeds (not inline)', () => {
  expect(md.render('[youtube iom_nhYQIYk 380 560]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="380" width="560" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds with no id (no embed)', () => {
  expect(md.render('[youtube  ]')).toBe(`<p>[youtube  ]</p>
`);
});

it('handles youtube embeds without width', () => {
  expect(md.render('[youtube iom_nhYQIYk 380]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="380" width="480" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds without width or height', () => {
  expect(md.render('[youtube iom_nhYQIYk]')).toBe(`<iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="270" width="480" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds attempting html injection', () => {
  expect(md.render('[youtube <script>alert();</script> 380 560]')).toBe(`<iframe src="https://www.youtube.com/embed/%3Cscript%3Ealert()%3B%3C%2Fscript%3E" class="youtube" height="380" width="560" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=%3Cscript%3Ealert()%3B%3C%2Fscript%3E" target="_blank">View YouTube video</a>
</iframe>
`);
});

it('handles youtube embeds attempting url manipulation', () => {
  expect(md.render('[youtube a/../../b 380 560]')).toBe(`<iframe src="https://www.youtube.com/embed/a%2F..%2F..%2Fb" class="youtube" height="380" width="560" frameborder="0" allowfullscreen>
    <a href="https://www.youtube.com/watch?v=a%2F..%2F..%2Fb" target="_blank">View YouTube video</a>
</iframe>
`);
});
