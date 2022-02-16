'use strict';

/**
 * Remove all nodes that have no text content recursively, including the given node.
 *
 * @param {Node} node
 */
const domRemoveEmpty = node => {
    for (const child of [ ...node.childNodes ]) domRemoveEmpty(child);
    if (node.textContent === '') node.parentNode.removeChild(node);
};

/**
 * Find the next sibling leaf node after a given node.
 * Explores up the tree as far as the given root to find the next leaf.
 *
 * @param {Node} node
 * @param {Node} root
 * @return {?Node}
 */
const domNextSiblingLeaf = (node, root) => {
    // If no direct sibling, backtrack to find the next sibling
    while (!node.nextSibling) {
        node = node.parentNode;
        if (node === root) return null;
    }

    // Move to that sibling
    node = node.nextSibling;

    // Ensure we're at the leaf
    while (node.firstChild) node = node.firstChild;
    return node;
};

/**
 * Find the correct node for a text offset from an existing node.
 * Will explore sibling leaf nodes up the tree as far as the given root.
 *
 * @param {Node} node
 * @param {number} offset
 * @param {Node} root
 * @param {boolean} [nextOnExact=false] Move to the next node if the offset is exactly the length of the current node.
 * @return {[Node,number]} The node the remaining offset is within.
 */
const domOffsetNode = (node, offset, root, nextOnExact = false) => {
    // TODO: Support negative offset with domPreviousSiblingLeaf
    if (offset < 0) throw new Error('Negative offset unsupported');

    // Short-circuit if we're already at the offset
    if (offset === 0) return [ node, 0 ];

    // Jump down to the leaf
    while (node.firstChild) node = node.firstChild;

    // While offset is larger than this node, or this isn't a text node, move along
    while (offset > node.textContent.length || (nextOnExact && offset === node.textContent.length) || node.nodeType !== 3) {
        // If text node, adjust offset
        if (offset > node.textContent.length || (nextOnExact && offset === node.textContent.length) && node.nodeType === 3) {
            offset -= node.textContent.length;
        }

        // Move to the next node
        node = domNextSiblingLeaf(node, root);
        if (node === null) throw new Error('Offset is larger than the document');
    }

    return [ node, offset ];
};

/**
 * Split a node at a given offset up to a given root.
 *
 * @param {Node} root
 * @param {Node} node
 * @param {?number} [offset=null]
 * @param {boolean} [nodeInRight=false] If the node to split on should be in the right tree of the split.
 * @return {{left: Node[], right: Node[]}}
 */
const domSplit = (root, node, offset = null, nodeInRight = false) => {
    if (!root.contains(node)) throw new Error('Node is not a child of root');

    // Handle offset in a node
    if (offset !== null && offset > 0) {
        // If the node should be in the left, and we're at the full length, don't offset
        if (nodeInRight || offset < node.textContent.length) {
            if (node.nodeType !== 3) throw new Error('Cannot offset on non-text node');
            if (offset > node.textContent.length) throw new Error('Offset is larger than the document');

            // Create a new node for us with the offset text
            const newNode = node.cloneNode(false);
            newNode.textContent = node.textContent.slice(offset);
            node.parentNode.insertBefore(newNode, node.nextSibling);

            // Leave the original node with the left text
            node.textContent = node.textContent.slice(0, offset);

            // Work with the new node
            node = newNode;
        }
    }

    // Move everything after our node in the branch to a new branch, working from the leaf up
    let bound = node;
    while (root !== bound.parentNode) {
        const parent = bound.parentNode;

        // Create the split if there are siblings, or self needs to be in right
        if (bound.nextSibling || nodeInRight) {
            // Move everything after the bound in the parent into a new sub-branch
            const right = parent.cloneNode(false);
            while (bound.nextSibling) right.appendChild(bound.nextSibling);

            // Add the new sub-branch after the bound's parent
            parent.parentNode.insertBefore(right, parent.nextSibling);

            // Handle having the node itself in the right branch
            if (nodeInRight) right.insertBefore(bound, right.firstChild);
        }

        // Move the bound up
        bound = parent;
    }

    // Get the left and right result in the DOM
    return [ ...root.childNodes ].reduce((obj, child) => {
        // Node in left, or node in right and in non-root parent
        if (child === bound.nextSibling) obj.right.push(child);

        // Node in right and in root
        else if (nodeInRight && node === bound && child === bound) obj.right.push(child);

        // In right if we're past the bound, else left
        else if (obj.right.length) obj.right.push(child);
        else obj.left.push(child);

        // Done
        return obj;
    }, { left: [], right: [] });
};

/**
 * Find a common ancestor of two nodes.
 *
 * @param {Node} node1
 * @param {Node} node2
 * @return {?Node}
 */
const domCommonAncestor = (node1, node2) => {
    let parent = node1.parentNode;
    while (parent) {
        if (parent.contains(node2)) return parent;
        parent = parent.parentNode;
    }
    return null;
};

/**
 * Check if all direct next siblings of a node have no text content.
 *
 * @param {Node} node
 * @return {boolean}
 */
const domNextSiblingsEmpty = node => {
    while (node.nextSibling) {
        if (node.nextSibling.textContent !== '') return false;
        node = node.nextSibling;
    }
    return true;
};

/**
 * Check if all direct previous siblings of a node have no text content.
 *
 * @param {Node} node
 * @return {boolean}
 */
const domPreviousSiblingsEmpty = node => {
    while (node.previousSibling) {
        if (node.previousSibling.textContent !== '') return false;
        node = node.previousSibling;
    }
    return true;
};

module.exports = {
    domRemoveEmpty,
    domOffsetNode,
    domSplit,
    domCommonAncestor,
    domNextSiblingsEmpty,
    domPreviousSiblingsEmpty,
};
