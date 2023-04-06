/*
Copyright 2023 DigitalOcean

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

/**
 * @module util/prism_keep_html
 */

const { Parser } = require('htmlparser2');
const { DomHandler, Element } = require('domhandler');
const { prepend, appendChild } = require('domutils');
const domserializer = require('dom-serializer').default;

const {
    domOffsetNode,
    domCommonAncestor,
    domSplit,
    domPreviousSiblingsEmpty,
    domNextSiblingsEmpty,
    domRemoveEmpty,
} = require('./dom_utils');

/**
 * Prism plugin to preserve existing HTML within the code. Supports non-browser environments.
 *
 * @param {import('prismjs')} Prism Prism instance to register plugin for.
 */
const plugin = Prism => {
    if (typeof Prism === 'undefined' || Prism.plugins.KeepHTML) return;

    Prism.plugins.KeepHTML = true;

    /**
     * @typedef {Object} ExtractedNode
     * @property {string} name Name of the HTML node.
     * @property {Object} attributes Attributes of the HTML node.
     * @property {number} open Position at which the node opens in the plain text.
     * @property {number} close Position at which the node closes in the plain text.
     * @property {number} depth Depth of the node in the tree.
     * @property {import('domhandler').Node} [openNode] Node in which this node opens, when injecting.
     * @property {number} [openPos] Position at which this node opens in the open node.
     * @property {import('domhandler').Node} [closeNode] Node in which this node closes, when injecting.
     * @property {number} [closePos] Position at which this node closes in the close node.
     * @private
     */

    /**
     * Extract plain-text and HTML nodes from a given HTML snippet.
     *
     * @param {string} html HTML snippet to extract nodes and text from.
     * @returns {{nodes: ExtractedNode[], text: string}}
     * @private
     */
    const extractTextAndNodes = html => {
        // Track the plain-text and all the HTML nodes we find
        let text = '';
        const allNodes = [];

        // Hold a temporary stack of open nodes
        const stack = [];

        // Parse the HTML
        const parser = new Parser({
            /**
             * Add opened tags to the stack, tracking their start position in the text and depth in the stack.
             *
             * @param {string} name Name of the opened tag.
             * @param {Object} attributes Attributes of the opened tag.
             * @private
             */
            onopentag: (name, attributes) => {
                // Add the node to the stack
                stack.push({
                    name,
                    attributes,
                    open: text.length,
                    depth: stack.length,
                });
            },
            /**
             * Track any plain-text encountered.
             *
             * @param {string} value Plain-text to track.
             * @private
             */
            ontext: value => {
                text += value;
            },
            /**
             * Remove the top of the stack when a tag is closed, tracking the close position in the text.
             *
             * @param {string} name Name of the closed tag.
             * @private
             */
            onclosetag: name => {
                // Remove the node from the stack
                const node = stack.pop();
                if (node.name !== name) throw new Error(`Unexpected closing tag in code, expecting </${node.name}> but got </${name}>`);
                node.close = text.length;
                allNodes.push(node);
            },
        });
        parser.write(html);
        parser.end();

        // Handle bad input HTML
        if (stack.length) throw new Error(`Unclosed tag(s) in code: ${stack.map(node => `<${node.name}>`).join(', ')}`);

        // Filter out token nodes, and sort by depth
        const nodes = allNodes
            .filter(node => node.name !== 'span' || !/(^| )token( |$)/.test(node.attributes.class || ''))
            .sort((a, b) => (a.depth !== b.depth
                // Deepest nodes first
                ? b.depth - a.depth
                // Fallback to start position
                : a.open - b.open));

        // Done
        return {
            text,
            nodes,
        };
    };

    /**
     * Parse a given HTML snippet into a DOM tree and inject extracted nodes back in.
     *
     * @param {string} html HTML snippet to parse.
     * @param {ExtractedNode[]} nodes Extracted nodes to inject into the parsed DOM.
     * @returns {string}
     * @private
     */
    const parseAndInsertNodes = (html, nodes) => {
        // Create the DOM handler, tracking nodes based on plain-text position
        const handler = new DomHandler();
        const { ontext } = handler;
        let pos = 0;

        /**
         * Process any text encountered, tracking the position of the nodes we want to inject.
         *
         * @param {string} value Plain-text to track.
         */
        handler.ontext = value => {
            ontext.call(handler, value);

            nodes.forEach(node => {
                // If this node starts within the text, track that
                if (!node.openNode && pos + value.length > node.open) {
                    node.openNode = handler.lastNode;
                    node.openPos = node.open - pos;
                }

                // If this node ends within the text, or at the end of it, track that
                if (!node.closeNode && pos + value.length >= node.close) {
                    node.closeNode = handler.lastNode;
                    node.closePos = node.close - pos;
                }
            });

            pos += value.length;
        };

        // Run the parser against the HTML
        const parser = new Parser(handler);
        parser.write(html);
        parser.end();

        // Inject our preserved HTML
        nodes.forEach(node => {
            if (!node.openNode || !node.closeNode) throw new Error(`Untracked node: ${JSON.stringify(node)}`);

            // Apply the offset to each and get the ancestor
            // Very loosely equivalent to creating a DOM Level 2 Range
            const { node: openNode, offset: openPos } = domOffsetNode(node.openNode, node.openPos, handler.root, true);
            let { node: closeNode, offset: closePos } = domOffsetNode(node.closeNode, node.closePos, handler.root);
            let ancestor = domCommonAncestor(openNode, closeNode);

            // Split the DOM and get the middle
            // Very loosely equivalent to using DOM Level 2 Range#extractContents
            const splitOpen = domSplit(ancestor, openNode, openPos);
            ({ node: closeNode, offset: closePos } = domOffsetNode(closeNode, closePos, handler.root)); // Update based on open split
            const splitClose = domSplit(ancestor, closeNode, closePos);
            const middle = splitOpen.right.filter(n => splitClose.left.includes(n));

            // No-op if no middle
            if (!middle.length) return;

            // If the middle is the whole of the parent, use the parent
            while (ancestor !== handler.root
            && middle[0].parentNode === middle[middle.length - 1].parentNode
            && domPreviousSiblingsEmpty(middle[0])
            && domNextSiblingsEmpty(middle[middle.length - 1])) {
                const parent = middle[0].parentNode;
                while (middle.length) middle.pop();
                middle.push(parent);
                ancestor = ancestor.parentNode;
            }

            // Wrap the middle
            const wrap = new Element(node.name, node.attributes);
            prepend(middle[0], wrap);
            middle.forEach(middleNode => appendChild(wrap, middleNode));
        });

        // Clean out any empty elements from splitting
        domRemoveEmpty(handler.root);

        // Done
        return domserializer(handler.root);
    };

    /**
     * Wrap highlight directly because Prism doesn't expose a hook for after highlight completes
     *
     * @param {function(string, import('prismjs').Grammar, string): string} original Original highlight function to wrap.
     * @returns {function(string, import('prismjs').Grammar, string): string}
     * @private
     */
    const highlight = original => (html, grammar, language) => {
        // Extract the plain-text and HTML nodes inside the code block
        const { text, nodes } = extractTextAndNodes(html);

        // Highlight the plain-text code with Prism
        const highlighted = original(text, grammar, language);

        // Re-insert the extracted HTML
        return parseAndInsertNodes(highlighted, nodes);
    };
    Prism.highlight = highlight(Prism.highlight);

    /**
     * Before Prism begins highlighting, disable the default HTML preservation and use raw HTML for the code.
     *
     * @param {Object} env Current Prism environment.
     * @private
     */
    const beforeSanityHook = env => {
        // Disable the standard keep-markup plugin
        env.element.classList.add('no-keep-markup');

        // Use the innerHTML instead of textContent
        env.code = env.element.innerHTML;
    };
    Prism.hooks.add('before-sanity-check', beforeSanityHook);

    /**
     * After Prism has finished highlighting, remove the class used to disable the default HTML preservation.
     *
     * @param {Object} env Current Prism environment.
     * @private
     */
    const beforeInsertHook = env => {
        // Remove the no-keep-markup class
        env.element.classList.remove('no-keep-markup');
    };
    Prism.hooks.add('before-insert', beforeInsertHook);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = plugin;
} else {
    plugin(Prism); /* global Prism */
}
