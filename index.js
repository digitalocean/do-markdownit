"use strict";

const highlight = require("./highlight");
const codePrefix = require("./codePrefix");
const codeMetadata = require("./codeMetadata");
const classAdders = require("./classAdders");
const embed = require("./embed");

/**
 * Handles patching in the behaivour to the markdown parser.
 * @param {markdownit} md - The markdown parser.
 * @param {Object} options - The options for the application.
 * @param {boolean} [options.highlight=true] - Defines if the highlight parser is on.
 * @param {boolean} [options.codePrefix=true] - Defines if code prefixes are on.
 * @param {boolean} [options.codeMetadata=true] - Defines if code metadata is on.
 * @param {boolean} [options.classAdders=true] - Defines if class adding tags are on.
 * @param {boolean} [options.embed=true] - Defines if embeds are on.
 * @param {boolean} [options.ampRequest=false] - Defines if this is an AMP Request.
 * @param {Number} [options.formId] - Defines the form ID.
 * @param {string} [options.canonicalUrl] - Defines the canonical URL.
*/
module.exports = (md, options) => {
	// Get the correct options.
	options = md.utils.assign({}, {}, options || {});

	// Add the custom parser behaviour.
	if (options.codeMetadata !== false) md.renderer.rules.fence = codeMetadata(md, md.renderer.rules.fence);
	if (options.codePrefix !== false) md.renderer.rules.fence = codePrefix(md.renderer.rules.fence);
	if (options.classAdders !== false) md.inline.ruler.push('classAdders', classAdders);
	if (options.highlight !== false) {
		md.inline.ruler.push('highlight', highlight.tokenize);
		md.renderer.rules.code_block = highlight.code(md.renderer.rules.code_block);
		md.renderer.rules.fence = highlight.code(md.renderer.rules.fence);
		md.renderer.rules.code_inline = highlight.code(md.renderer.rules.code_inline);
	}
	if (options.embed !== false) {
		const ampRequest = typeof options.ampRequest === "boolean" ? options.ampRequest : false;
		const formId = typeof options.formId === "number" ? options.formId : null;
		const canonicalUrl = typeof options.canonicalUrl === "string" ? options.canonicalUrl : null;
		md.renderer.renderInline = embed(md, formId, ampRequest, canonicalUrl, md.renderer.renderInline.bind(md.renderer));
		md.renderer.render = embed(md, formId, ampRequest, canonicalUrl, md.renderer.render.bind(md.renderer));
	}
};
