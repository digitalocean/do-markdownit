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

/**
 * Remove all nodes that have no text content recursively, including the given node.
 *
 * @param {Node} node Node to remove empty nodes from (including self).
 */
const domRemoveEmpty = node => {
    for (const child of [ ...node.childNodes ]) domRemoveEmpty(child);
    if (node.textContent === '') node.parentNode.removeChild(node);
};

/**
 * Find the next sibling leaf node after a given node.
 * Explores up the tree as far as the given root to find the next leaf.
 *
 * @param {Node} node Node to find next leaf for.
 * @param {Node} root Node to consider the root of the tree.
 * @returns {?Node}
 */
const domNextSiblingLeaf = (node, root) => {
    let workingNode = node;

    // If no direct sibling, backtrack to find the next sibling
    while (!workingNode.nextSibling) {
        workingNode = workingNode.parentNode;
        if (workingNode === root) return null;
    }

    // Move to that sibling
    workingNode = workingNode.nextSibling;

    // Ensure we're at the leaf
    while (workingNode.firstChild) workingNode = workingNode.firstChild;
    return workingNode;
};

/**
 * Find the correct node for a text offset from an existing node.
 * Will explore sibling leaf nodes up the tree as far as the given root.
 *
 * @param {Node} node Node to start exploring from.
 * @param {number} offset Text offset to find node for.
 * @param {Node} root Node to consider the root of the tree.
 * @param {boolean} [nextOnExact=false] Move to the next node if the offset is exactly the length of the current node.
 * @returns {[Node,number]} The node the remaining offset is within.
 */
const domOffsetNode = (node, offset, root, nextOnExact = false) => {
    // TODO: Support negative offset with domPreviousSiblingLeaf
    if (offset < 0) throw new Error('Negative offset unsupported');

    // Short-circuit if we're already at the offset
    if (offset === 0) return [ node, 0 ];

    // Jump down to the leaf
    let workingNode = node;
    while (workingNode.firstChild) workingNode = workingNode.firstChild;

    // While offset is larger than this node, or this isn't a text node, move along
    let workingOffset = offset;
    while (workingNode.nodeType !== 3
    || workingOffset > workingNode.textContent.length
    || (nextOnExact && workingOffset === workingNode.textContent.length)) {
        // If text node, adjust offset
        if (workingNode.nodeType === 3
            && (workingOffset > workingNode.textContent.length
                || (nextOnExact && workingOffset === workingNode.textContent.length))) {
            workingOffset -= workingNode.textContent.length;
        }

        // Move to the next node
        workingNode = domNextSiblingLeaf(workingNode, root);
        if (workingNode === null) throw new Error('Offset is larger than the document');
    }

    return [ workingNode, workingOffset ];
};

/**
 * Split a node at a given offset up to a given root.
 *
 * @param {Node} root Node to consider the root of the tree.
 * @param {Node} node Node to split.
 * @param {?number} [offset=null] Optional offset to split at.
 * @param {boolean} [nodeInRight=true] If the node to split on should be in the right tree of the split.
 * @returns {{left: Node[], right: Node[]}}
 */
const domSplit = (root, node, offset = null, nodeInRight = true) => {
    if (!root.contains(node)) throw new Error('Node is not a child of root');

    // Handle offset in a node
    let workingNode = node;
    if (offset !== null && offset > 0) {
        // If the node should be in the left, and we're at the full length, don't offset
        if (nodeInRight || offset < workingNode.textContent.length) {
            if (workingNode.nodeType !== 3) throw new Error('Cannot offset on non-text node');
            if (offset > workingNode.textContent.length) throw new Error('Offset is larger than the document');

            // Create a new node for us with the offset text
            const newNode = workingNode.cloneNode(false);
            newNode.textContent = workingNode.textContent.slice(offset);
            workingNode.parentNode.insertBefore(newNode, workingNode.nextSibling);

            // Leave the original node with the left text
            workingNode.textContent = workingNode.textContent.slice(0, offset);

            // Work with the new node
            workingNode = newNode;
        }
    }

    // Move everything after our node in the branch to a new branch, working from the leaf up
    let bound = workingNode;
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
        else if (nodeInRight && workingNode === bound && child === bound) obj.right.push(child);

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
 * @param {Node} node1 First node to consider.
 * @param {Node} node2 Second node to consider.
 * @returns {?Node}
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
 * @param {Node} node Node to consider.
 * @returns {boolean}
 */
const domNextSiblingsEmpty = node => {
    let workingNode = node;
    while (workingNode.nextSibling) {
        if (workingNode.nextSibling.textContent !== '') return false;
        workingNode = workingNode.nextSibling;
    }
    return true;
};

/**
 * Check if all direct previous siblings of a node have no text content.
 *
 * @param {Node} node Node to consider.
 * @returns {boolean}
 */
const domPreviousSiblingsEmpty = node => {
    let workingNode = node;
    while (workingNode.previousSibling) {
        if (workingNode.previousSibling.textContent !== '') return false;
        workingNode = workingNode.previousSibling;
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
