/*
Copyright 2024 DigitalOcean

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

const { Parser } = require('htmlparser2');
const { DomHandler, Element } = require('domhandler');
const { textContent, appendChild } = require('domutils');

const {
    domRemoveEmpty,
    domOffsetNode,
    domSplit,
    domCommonAncestor,
    domNextSiblingsEmpty,
    domPreviousSiblingsEmpty,
} = require('./dom_utils');

/**
 * Parse HTML into a root element containing the document nodes.
 *
 * @param {string} html HTML to parse.
 * @returns {import('domhandler').Element}
 */
const parseRoot = html => {
    let dom;
    const handler = new DomHandler((err, nodes) => {
        if (err) throw err;
        dom = nodes;
    });
    new Parser(handler).end(html);
    const root = new Element('root', {});
    dom.forEach(node => appendChild(root, node));
    return root;
};

it('removes empty nodes recursively', () => {
    const root = parseRoot('<p>keep</p><span></span>');
    domRemoveEmpty(root);
    expect(textContent(root)).toContain('keep');
    expect(root.children.some(n => n.name === 'span')).toBe(false);
});

it('finds a common ancestor of two nodes', () => {
    const root = parseRoot('<div><b>a</b><i>b</i></div>');
    const div = root.children[0];
    const bold = div.children[0];
    const italic = div.children[1];
    expect(domCommonAncestor(bold, italic)).toBe(div);
});

it('reports whether next siblings are empty', () => {
    const root = parseRoot('<p>text<span></span></p>');
    const p = root.children[0];
    const text = p.children[0];
    expect(domNextSiblingsEmpty(text)).toBe(true);
});

it('reports whether previous siblings are empty', () => {
    const root = parseRoot('<p><span></span>text</p>');
    const p = root.children[0];
    const text = p.children[1];
    expect(domPreviousSiblingsEmpty(text)).toBe(true);
});

it('resolves a text offset within a document', () => {
    const root = parseRoot('<p>hello world</p>');
    const p = root.children[0];
    const text = p.children[0];
    const result = domOffsetNode(text, 6, root);
    expect(result.node).toBe(text);
    expect(result.offset).toBe(6);
    expect(textContent(result.node).slice(result.offset)).toBe('world');
});

it('splits a text node under a root', () => {
    const root = parseRoot('<p>abcdef</p>');
    const p = root.children[0];
    const text = p.children[0];
    const { left, right } = domSplit(p, text, 3, true);
    expect(left.map(n => textContent(n)).join('')).toBe('abc');
    expect(right.map(n => textContent(n)).join('')).toBe('def');
});

it('throws when offset is negative', () => {
    const root = parseRoot('<p>x</p>');
    expect(() => domOffsetNode(root.children[0].children[0], -1, root)).toThrow(/Negative offset/);
});
