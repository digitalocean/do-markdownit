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
 * @module rules/embeds/glitch
 */

/**
 * Add support for [Glitch](https://glitch.com/) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[glitch <slug>]`. E.g. `[glitch hello-digitalocean]`.
 * After the slug, some space-separated flags can be added (in any combination/order):
 *
 * - Add `noattr` to tell Glitch to not show the authors of the project.
 * - Add `code` to set the Glitch embed to show the project code by default.
 * - Add `notree` to set the Glitch embed to collapse the file tree by default.
 * - Add `path=` followed by a file path to set the Glitch embed to show a specific file by default.
 * - Add `highlights=` followed by a comma-separated list of line numbers to tell Glitch to highlight those lines.
 * - Add any set of digits to set the height of the embed (in pixels).
 *
 * @example
 * [glitch hello-digitalocean]
 *
 * [glitch hello-digitalocean code 512 notree path=src/app.jsx]
 *
 * <div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
 *     <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
 *         <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
 *     </iframe>
 * </div>
 *
 * <div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
 *     <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=0&sidebarCollapsed=true&path=src%2Fapp.jsx" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
 *         <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
 *     </iframe>
 * </div>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Glitch markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const glitchRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 10) return false; // [glitch a]
        if (currentLine.slice(0, 8) !== '[glitch ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for glitch match
        const match = currentLine.match(/^\[glitch (\S+)((?: (?:noattr|code|notree|path=\S+|highlights=\d+(?:,\d+)*|\d+))*)\]$/);
        if (!match) return false;

        // Get the slug
        const slug = match[1];
        if (!slug) return false;

        // Get the raw flags
        const flags = match[2].split(' ');

        // Get the height
        const heightMatch = flags.find(flag => flag.match(/^\d+$/));
        const height = Number(heightMatch) || 256;

        // Defines if the embed should hide attribution
        const noAttr = flags.includes('noattr');

        // Defines if the embed should default to the code
        const code = flags.includes('code');

        // Defines if the embed should default to collpasing the file tree
        const noTree = flags.includes('notree');

        // Get the path
        const pathMatch = flags.find(flag => flag.match(/^path=\S+$/));
        const path = pathMatch && pathMatch.slice(5);

        // Get the highlights
        const highlightsMatch = flags.find(flag => flag.match(/^highlights=\d+(?:,\d+)*$/));
        const highlights = highlightsMatch && highlightsMatch.slice(11).split(',').map(Number);

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('glitch', 'glitch', 0);
        token.block = true;
        token.markup = match[0];
        token.glitch = { slug, height, noAttr, code, noTree, path, highlights };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'glitch', glitchRule);

    /**
     * Rendering rule for Glitch markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.glitch = (tokens, index) => {
        const token = tokens[index];

        // Escape some HTML
        const slug = md.utils.escapeHtml(token.glitch.slug);
        const slugUrl = encodeURIComponent(token.glitch.slug);

        // Construct the params
        const params = new URLSearchParams();
        if (token.glitch.noAttr) params.append('attributionHidden', 'true');
        params.append('previewSize', token.glitch.code ? '0' : '100');
        if (token.glitch.noTree) params.append('sidebarCollapsed', 'true');
        if (token.glitch.path) params.append('path', token.glitch.path);
        if (token.glitch.highlights) params.append('highlights', token.glitch.highlights.join(','));

        // Return the HTML
        return `<div class="glitch-embed-wrap" style="height: ${token.glitch.height}px; width: 100%;">
    <iframe src="https://glitch.com/embed/#!/embed/${slugUrl}?${params.toString()}" title="${slug} on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
        <a href="https://glitch.com/edit/#!/${slugUrl}" target="_blank">View ${slug} on Glitch</a>
    </iframe>
</div>\n`;
    };
};
