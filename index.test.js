const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'fixtures', 'full-input.md'), 'utf8');
const output = fs.readFileSync(path.join(__dirname, 'fixtures', 'full-output.html'), 'utf8');

it('imports, loads and renders properly', () => {
  // Create a new instance, testing the options the plugins support
  const md = require('markdown-it')({
    langPrefix: '',
    linkify: true,
    typographer: true,
  }).use(require('.'), {
    fence_environment: {
      allowedEnvironments: [ 'local', 'second', 'third', 'fourth', 'fifth' ],
    },
    fence_classes: {
      allowedClasses: [
        'prefixed', 'line_numbers', 'command', 'super_user', 'custom_prefix',
        ...[ 'local', 'second', 'third', 'fourth', 'fifth' ].map(env => `environment-${env}`),
      ],
    },
    callout: {
      allowedClasses: [ 'note', 'warning', 'info', 'draft' ],
    },
  });

  // Render and check output
  const rendered = md.render(input);
  // fs.writeFileSync(path.join(__dirname, 'fixtures', 'full-output.html'), rendered);
  expect(rendered).toBe(output);
});
