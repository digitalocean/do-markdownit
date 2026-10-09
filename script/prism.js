/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Get all files within a given directory recursively.
 *
 * @param {string} dir Directory to explore.
 * @returns {string[]}
 * @private
 */
const getFilesInDir = dir => fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(file => (file.isDirectory() ? getFilesInDir(path.join(dir, file.name)) : path.join(dir, file.name)));

/**
 * Copy all files recursively from within a given directory to a given destination.
 *
 * @param {string} src Directory to copy from.
 * @param {string} dest Directory to copy to.
 * @private
 */
const copyRecursively = (src, dest) => {
    const exists = fs.existsSync(src);
    if (!exists) throw new Error(`${src} does not exist`);

    if (fs.lstatSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        for (const child of fs.readdirSync(src)) copyRecursively(path.join(src, child), path.join(dest, child));
    } else {
        fs.copyFileSync(src, dest);
    }
};

const base = path.join(__dirname, '..', 'vendor', 'prismjs');

console.info('Patching Prism to avoid window + global pollution...');

// Clean out the directory, and create it
if (fs.existsSync(base)) fs.rmSync(base, { recursive: true });
fs.mkdirSync(base, { recursive: true });

// Copy Prism over
copyRecursively(path.dirname(require.resolve('prismjs')), base);

// Patch the core to not use `window` or `global`
const core = path.join(base, 'prism.js');
fs.writeFileSync(
    core,
    fs.readFileSync(core, 'utf8')
        .replace(/\nvar _self = [^;]+;\n/, '\nvar _self = {};\n') // Always use an object, not window or global
        .replace('global.Prism = Prism;', '// global.Prism = Prism;'), // Don't bind to global
);

// Patch the autoloader to not rely on global Prism
const autoloader = path.join(base, 'components', 'index.js');
fs.writeFileSync(
    autoloader,
    fs.readFileSync(autoloader, 'utf8')
        .replace(/((\n[ \t*]*)@param {string\|string\[]} \[languages])/, '$2@param {Prism} Prism$1') // Update jsdoc to include Prism
        .replace(/loadLanguages\((.+?)\)/g, 'loadLanguages(Prism, $1)') // Accept Prism as a parameter
        .replace('require(pathToLanguage)', 'require(pathToLanguage)(Prism)'), // Pass Prism when loading a language
);

/**
 * Template to wrap an unminified Prism component to export when in a module context.
 *
 * @param {string} source Source code of the component.
 * @returns {string}
 * @private
 */
const template = source => `const component = Prism => {\n\t${source.replace(/\n/g, '\n\t')}\n};\n\nif (typeof module !== 'undefined' && module.exports) {\n\tmodule.exports = component;\n} else {\n\tcomponent(Prism);\n}\n`;

// Patch all the components (except autoloader) + plugins to export functions
const components = getFilesInDir(path.join(base, 'components')).filter(f => f !== autoloader && f.endsWith('.js'));
const plugins = getFilesInDir(path.join(base, 'plugins')).filter(f => f.endsWith('.js'));
for (const file of components.concat(plugins)) {
    // Remove minified versions
    if (file.endsWith('.min.js')) {
        fs.unlinkSync(file);
        continue;
    }

    // Patch the unminified version
    fs.writeFileSync(file, template(fs.readFileSync(file, 'utf8').trim()));
}

// Patch the markdown component to only register itself once per Prism instance.
// The component registers hooks and defines the `markdown` grammar. Consumers
// bundling several copies of do-markdownit (one per chunk or build target)
// invoke the component once per copy against the same shared Prism singleton,
// stacking its hooks each time. Guarding the whole body keeps registration —
// and the grammar definition — idempotent.
const markdownComponent = path.join(base, 'components', 'prism-markdown.js');
fs.writeFileSync(
    markdownComponent,
    fs.readFileSync(markdownComponent, 'utf8')
        .replace(
            'const component = Prism => {',
            [
                'const component = Prism => {',
                '\t// Guard against registering this component more than once on the same Prism',
                '\t// instance — repeated registration stacks its hooks.',
                '\tif (Prism.plugins.doMarkdownRegistered) return;',
                '\tPrism.plugins.doMarkdownRegistered = true;',
            ].join('\n'),
        ),
);

console.info('Prism patched successfully!');
