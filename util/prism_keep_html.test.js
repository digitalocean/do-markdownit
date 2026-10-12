/*
Copyright 2026 DigitalOcean

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
 * Tests for the keep-HTML Prism plugin.
 *
 * Covers the tag/attribute allowlist applied to preserved markup, and the
 * single-registration guarantee for the vendored Prism markdown component.
 */

const markdownIt = require('markdown-it');
const Prism = require('../vendor/prismjs');

// Wrap hooks registered by the Prism core itself, measured before the markdown
// component loads. The markdown component must add exactly one on top of this.
// (The `prism-markup` dependency also carries its own copy of the core's
// entity-title hook — upstream behavior, unrelated to this guarantee.)
const baseWrapHookCount = Prism.hooks.all.wrap.length;

/**
 * Count how many times the vendored Prism markdown component's `wrap` hook is
 * registered. The hook is identified by its distinctive code-block guard, so
 * unrelated upstream hooks (e.g. the entity-title hook) don't affect the count.
 *
 * @returns {number}
 * @private
 */
const markdownWrapHookCount = () => Prism.hooks.all.wrap
    .filter(hook => String(hook).includes('env.type !== \'code-block\'')).length;

/**
 * Render markdown through the same pipeline used in production, registering the
 * vendored Prism markdown component an arbitrary number of times to simulate
 * consumers that bundle several copies of do-markdownit (one per chunk or build
 * target), each invoking the component against the same shared Prism singleton.
 *
 * @param {string} input Markdown source to render.
 * @param {number} [registrations=1] How many times the markdown component should be invoked.
 * @returns {string}
 * @private
 */
const renderWithRegistrations = (input, registrations = 1) => {
    const component = require('../vendor/prismjs/components/prism-markdown');
    for (let r = 0; r < registrations; r += 1) component(Prism);

    const md = markdownIt().use(require('../modifiers/prismjs'), { logging: true });
    return md.render(input).toString();
};

describe('markdown component registration', () => {
    // Entity-encoded markup inside a nested code fence
    const nested = '````markdown\n```js\n&lt;audio src=x onerror=alert(origin)&gt;Y&lt;/audio&gt;\n```\n````';

    it('renders entity-encoded markup in nested code fences as escaped text when the wrap hook is registered once', () => {
        const rendered = renderWithRegistrations(nested, 1);
        // No live element — the markup only ever exists as escaped source text
        expect(rendered).not.toContain('<audio');
        expect(rendered).toContain('audio');
    });

    it('renders entity-encoded markup in nested code fences as escaped text no matter how many times the markdown component is invoked', () => {
        const rendered = renderWithRegistrations(nested, 7);
        expect(rendered).not.toContain('<audio');
        expect(rendered).toContain('audio');
    });

    it('registers the wrap hook exactly once regardless of component invocation count', () => {
        renderWithRegistrations('```markdown\n# hello\n```', 1);
        const once = markdownWrapHookCount();
        expect(once).toBe(1);

        // Seven invocations must not stack the hook further
        renderWithRegistrations('```markdown\n# hello\n```', 7);
        expect(markdownWrapHookCount()).toBe(once);
        expect(Prism.hooks.all.wrap.length).toBe(baseWrapHookCount + 2);
    });
});

describe('keep-HTML tag and attribute allowlist', () => {
    /**
     * Highlight code containing live markup directly, bypassing markdown-it
     * escaping.
     *
     * @param {string} code Code to highlight as JavaScript.
     * @returns {string}
     * @private
     */
    const highlightRaw = code => Prism.highlight(code, Prism.languages.javascript, 'javascript');

    it('drops non-allowlisted elements while keeping their content as highlighted text', () => {
        const highlighted = highlightRaw('<audio src=x onerror=alert(origin)>Y</audio>');
        expect(highlighted).not.toMatch(/<audio/);
        expect(highlighted).not.toContain('onerror');
        // The inner content survives, highlighted as usual
        expect(highlighted).toContain('Y');
    });

    it('drops event handler attributes from preserved elements', () => {
        const highlighted = highlightRaw('<span class="token-ish" onclick="alert(1)">Y</span>');
        // The span survives with its class, the handler is gone
        expect(highlighted).toContain('<span class="token-ish"><span class="token constant">Y</span></span>');
        expect(highlighted).not.toContain('onclick');
    });

    it('rejects javascript:, data: and vbscript: URLs on preserved elements', () => {
        // eslint-disable-next-line no-script-url -- deliberately testing a script URL is stripped
        expect(highlightRaw('<a href="javascript:alert(1)">Y</a>')).not.toContain('javascript:');
        expect(highlightRaw('<a href="JaVaScRiPt:alert(1)">Y</a>')).not.toMatch(/javascript/i);
        expect(highlightRaw('<a href="java\tscript:alert(1)">Y</a>')).not.toMatch(/javascript/i);
        expect(highlightRaw('<a href="java\x00script:alert(1)">Y</a>')).not.toMatch(/javascript/i);
        expect(highlightRaw('<a href="java\x01script:alert(1)">Y</a>')).not.toMatch(/javascript/i);
        expect(highlightRaw('<a href="java\x7fscript:alert(1)">Y</a>')).not.toMatch(/javascript/i);
        expect(highlightRaw('<a href="data:text/html,<script>Y</script>">Y</a>')).not.toContain('data:');
        expect(highlightRaw('<a href="vbscript:msgbox">Y</a>')).not.toContain('vbscript:');
    });

    it('keeps safe URLs and non-URL attributes on preserved elements', () => {
        expect(highlightRaw('<a href="https://www.digitalocean.com">Y</a>')).toContain('href="https://www.digitalocean.com"');
        expect(highlightRaw('<a href="/community">Y</a>')).toContain('href="/community"');
        expect(highlightRaw('<a href="mailto:docs@digitalocean.com">Y</a>')).toContain('mailto:');
    });

    it('preserves the markup our own modifiers legitimately inject', () => {
        // The `<^>...<^>` highlight rule emits `<mark>` elements (rules/highlight).
        // The inner text is js-highlighted as usual; the element itself survives.
        expect(highlightRaw('<mark>Y</mark>')).toContain('<mark><span class="token constant">Y</span></mark>');

        // The fence_prefix modifier emits `<ol><li data-prefix="...">` wrappers
        const md = markdownIt()
            .use(require('../modifiers/fence_prefix'))
            .use(require('../modifiers/prismjs'), { logging: true });
        const rendered = md.render('```line_numbers,js\nhello\nworld\n```').toString();
        expect(rendered).toContain('<ol><li data-prefix="1">');
        expect(rendered).toContain('<li data-prefix="2">');
    });
});
