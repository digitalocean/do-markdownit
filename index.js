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
	if (options.codePrefix !== false) md.renderer.rules.fence = codePrefix(md.renderer.rules.fence);
	if (options.codeEnvironment !== false) md.renderer.rules.fence = codeEnvironment(md.renderer.rules.fence);
	if (options.classAdders !== false) md.inline.ruler.push('classAdders', classAdders);
	if (options.highlight !== false) {
		md.inline.ruler.push('highlight', highlight.tokenize);
		md.renderer.rules.code_block = highlight.code(md.renderer.rules.code_block);
		md.renderer.rules.fence = highlight.code(md.renderer.rules.fence);
		md.renderer.rules.code_inline = highlight.code(md.renderer.rules.code_inline);
	}
};
