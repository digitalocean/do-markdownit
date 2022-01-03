const fs = require('fs');
const path = require('path');

const getFilesInDir = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(file => (file.isDirectory() ? getFilesInDir(path.join(dir, file.name)) : path.join(dir, file.name)));

const base = path.join(process.cwd(), 'vendor', 'prismjs');

// Patch the core to not use `window` or `global`
let core = fs.readFileSync(path.join(base, 'prism.js'), 'utf8');
core = core.replace(/\nvar _self = [^;]+;\n/, '\nvar _self = {};\n');
core = core.replace(/\/\/\/ <reference lib="WebWorker"\/>\n+/, '');
core = core.replace(/global\.Prism = Prism;/, '// global.Prism = Prism;');
fs.writeFileSync(path.join(base, 'prism.js'), core);

// Remove the auto-loader
fs.unlinkSync(path.join(base, 'components', 'index.js'));

// Patch all the components + plugins to export functions
const components = getFilesInDir(path.join(base, 'components')).filter(f => f.endsWith('.js'));
const plugins = getFilesInDir(path.join(base, 'plugins')).filter(f => f.endsWith('.js'));
for (const file of components.concat(plugins)) {
  let source = fs.readFileSync(file, 'utf8');
  source = `module.exports = Prism => {\n\t${source.trim().replace(/\n/g, '\n\t')}\n};\n`;
  fs.writeFileSync(file, source);
}
