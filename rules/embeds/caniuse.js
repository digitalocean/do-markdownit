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
 * @module rules/embeds/caniuse
 */

const safeObject = require('../../util/safe_object');
/**
 * Add support for [CanIUse](https://caniuse.com/) embeds in Markdown, as block syntax.
 * Uses https://caniuse.bitsofco.de/ to provide interactive embeds from CanIUse data.
 *
 * The basic syntax is `[caniuse <feature>]`. E.g. `[caniuse css-grid]`.
 * After the slug, some space-separated flags can be added (in any combination/order):
 *
 * - Add `past=` followed by a number to control how many previous browser versions to include (default is 1, supported 0-5).
 * - Add `future=` followed by a number to control how many previous browser versions to include (default is 1, supported 0-3).
 * - Add `accessible` to set the default color scheme for the CanIUse embed to be accessible colors.
 *
 * @example
 * [caniuse css-grid]
 *
 * [caniuse css-grid past=5 future=3 accessible]
 *
 * <p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1" data-accessible-colours="false">
 *     <picture>
 *         <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
 *         <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
 *         <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
 *     </picture>
 * </p>
 *
 * <p class="ciu_embed" data-periods="future_3,future_2,future_1,current,past_1,past_2,past_3,past_4,past_5" data-accessible-colours="true">
 *     <picture>
 *         <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/ambient-light.webp" />
 *         <source type="image/png" srcset="https://caniuse.bitsofco.de/image/ambient-light.png" />
 *         <img src="https://caniuse.bitsofco.de/image/ambient-light.jpg" alt="Data on support for the ambient-light feature across the major browsers from caniuse.com" />
 *     </picture>
 * </p>
 * <script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for CanIUse markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const canIUseRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 11) return false; // [caniuse a]
        if (currentLine.slice(0, 9) !== '[caniuse ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for glitch match
        const match = currentLine.match(/^\[caniuse (\S+)((?: (?:past=[0-5]|future=[0-3]|accessible))*)\]$/);
        if (!match) return false;

        // Get the slug
        const slug = match[1];
        if (!slug) return false;

        // Get the raw flags
        const flags = match[2].split(' ');

        // Get the past count
        const pastMatch = flags.find(flag => flag.match(/^past=[0-5]$/));
        const past = !pastMatch || Number.isNaN(Number(pastMatch.slice(5))) ? 1 : Number(pastMatch.slice(5));

        // Get the past count
        const futureMatch = flags.find(flag => flag.match(/^future=[0-3]$/));
        const future = !futureMatch || Number.isNaN(Number(futureMatch.slice(7))) ? 1 : Number(futureMatch.slice(7));

        // Defines if the embed should be accessible
        const accessible = flags.includes('accessible');

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('caniuse', 'caniuse', 0);
        token.block = true;
        token.markup = match[0];
        token.caniuse = { slug, past, future, accessible };

        // Track that we need the script
        state.env.caniuse = safeObject(state.env.caniuse);
        state.env.caniuse.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'caniuse', canIUseRule);

    /**
     * Parsing rule to inject the CanIUse script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const canIUseScriptRule = state => {
        // Check if we need to inject the script
        if (state.env.caniuse && state.env.caniuse.tokenized && !state.env.caniuse.injected) {
            // Set that we've injected it
            state.env.caniuse.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('caniuse_script', canIUseScriptRule);

    /**
     * Rendering rule for CanIUse markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.caniuse = (tokens, index) => {
        const token = tokens[index];

        // Construct the attrs
        const attrPeriodsFuture = Array(token.caniuse.future).fill('').map((_, i) => `future_${i + 1}`).reverse();
        const attrPeriodsPast = Array(token.caniuse.past).fill('').map((_, i) => `past_${i + 1}`);
        const attrPeriods = md.utils.escapeHtml([ ...attrPeriodsFuture, 'current', ...attrPeriodsPast ].join(','));
        const attrAccessibleColours = md.utils.escapeHtml(token.caniuse.accessible.toString());

        // Escape some HTML
        const feature = md.utils.escapeHtml(token.caniuse.slug);
        const featureUrl = encodeURIComponent(token.caniuse.slug);

        // Return the HTML
        return `<p class="ciu_embed" data-feature="${feature}" data-periods="${attrPeriods}" data-accessible-colours="${attrAccessibleColours}">
    <picture>
        <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/${featureUrl}.webp" />
        <source type="image/png" srcset="https://caniuse.bitsofco.de/image/${featureUrl}.png" />
        <img src="https://caniuse.bitsofco.de/image/${featureUrl}.jpg" alt="Data on support for the ${feature} feature across the major browsers from caniuse.com" />
    </picture>
</p>\n`;
    };
};
