"use strict";

const highlight = require("./highlight");
const codePrefix = require("./codePrefix");
const codeEnvironment = require("./codeEnvironment");
const classAdders = require("./classAdders");

/**
 * Handles patching in the behaivour to the markdown parser.
 * @param {markdownit} md - The markdown parser.
 * @param {Object} options - The options for the application.
 * @param {boolean} [options.highlight=true] - Defines if the highlight parser is on.
 * @param {boolean} [options.codePrefix=true] - Defines if code prefixes are on.
 * @param {boolean} [options.codeEnvironment=true] - Defines if code environment is on.
 * @param {boolean} [options.classAdders=true] - Defines if class adding tags are on.
 */
module.exports = (md, options) => {
	// Get the correct options.
	options = md.utils.assign({}, {}, options || {});

	// Add the custom parser behaviour.
	if (options.codePrefix !== false) md.renderer.fence = codePrefix(md.renderer.fence);
	if (options.codeEnvironment !== false) md.renderer.fence = codeEnvironment(md.renderer.fence);
	if (options.classAdders !== false) md.inline.ruler.push('classAdders', classAdders);
	if (options.highlight !== false) {
		md.inline.ruler.push('highlight', highlight.tokenize);
		md.renderer.code_block = highlight.code(md.renderer.code_block);
		md.renderer.fence = highlight.code(md.renderer.fence);
		md.renderer.code_inline = highlight.code(md.renderer.code_inline);
	}
};
