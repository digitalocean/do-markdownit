'use strict';

const domRemoveEmpty = node => {
    for (const child of [ ...node.childNodes ]) domRemoveEmpty(child);
    if (node.textContent === '') node.parentNode.removeChild(node);
};

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

const domCommonAncestor = (node1, node2) => {
    let parent = node1.parentNode;
    while (parent) {
        if (parent.contains(node2)) return parent;
        parent = parent.parentNode;
    }
    return null;
};

const domNextSiblingsEmpty = node => {
    while (node.nextSibling) {
        if (node.nextSibling.textContent !== '') return false;
        node = node.nextSibling;
    }
    return true;
};

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
