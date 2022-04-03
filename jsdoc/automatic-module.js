const { join, relative } = require('path');
const env = require('jsdoc/env');
const { Doclet } = require('jsdoc/doclet');
const { name } = require(join(env.pwd, 'package.json'));

const cache = new Map();

const getModuleName = file => join(name, relative(env.pwd, file.endsWith('/index.js')
    ? file.slice(0, -9)
    : file.slice(0, -3)));

exports.handlers = {
    newDoclet: ({ doclet }) => {
        const file = join(doclet.meta.path, doclet.meta.filename);

        // Track any files that already have a module declared
        if (doclet.kind === 'module') cache.set(file, null);
        if (cache.has(file)) return;

        // Use module exports for the module if available
        if (doclet.kind === 'function' && doclet.longname === 'module.exports') {
            const module = getModuleName(file);

            // Create a new undocumented doclet for the export itself
            const codeDoclet = new Doclet('', {
                ...doclet.meta,
                id: doclet.meta.code.id,
            });
            codeDoclet.undocumented = true;
            codeDoclet.name = `module:${module}`;
            codeDoclet.longname = `module:${module}`;
            cache.set(file, codeDoclet);

            // Repurpose the export doclet as the module doclet
            doclet.name = module;
            doclet.longname = `module:${module}`;
            doclet.kind = 'module';
            doclet.meta.code = {};
            doclet.meta.lineno -= doclet.comment.split('\n').length;
            delete doclet.meta.range;
            delete doclet.meta.vars;
            delete doclet.memberof;
            delete doclet.scope;
        }
    },
    parseComplete: ({ sourcefiles, doclets }) => {
        for (const file of sourcefiles) {
            // Inject generated modules for exports
            const res = cache.get(file);
            if (res) {
                doclets.push(res);
                continue;
            }

            // Generate module doclets for files that don't have one
            if (!cache.has(file)) {
                doclets.push(new Doclet(
                    `/** @module ${getModuleName(file)} */`,
                    { filename: file, lineno: -1, columnno: -1 },
                ));
            }
        }
    }
};
