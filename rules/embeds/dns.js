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
 * @module rules/embeds/dns
 */

const safeObject = require('../../util/safe_object');

/**
 * Add support for [DNS lookup](https://www.digitalocean.com/community/tools/dns) embeds in Markdown, as block syntax.
 *
 * The basic syntax is `[dns <domain>]`. E.g. `[dns digitalocean.com]`.
 * After the domain, one or more space-separated DNS record types can be added. The default type is `A`.
 *
 * @example
 * [dns digitalocean.com]
 *
 * [dns digitalocean.com A AAAA]
 *
 * <div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A">
 *     <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
 *         Perform a full DNS lookup for digitalocean.com
 *     </a>
 * </div>
 *
 * <div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A,AAAA">
 *     <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
 *         Perform a full DNS lookup for digitalocean.com
 *     </a>
 * </div>
 * <script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for DNS lookup markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const dnsRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 7) return false; // [dns a]
        if (currentLine.slice(0, 5) !== '[dns ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for dns match
        const match = currentLine.match(/^\[dns (\S+?)(?: (.+))?\]$/);
        if (!match) return false;

        // Get the domain
        const domain = match[1];
        if (!domain) return false;

        // Get the types
        const types = (match[2] || '').split(/ +/).filter(x => !!x).join(',') || 'A';

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('dns', 'dns', 0);
        token.block = true;
        token.markup = match[0];
        token.dns = { domain, types };

        // Track that we need the script
        state.env.dns = safeObject(state.env.dns);
        state.env.dns.tokenized = true;

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'dns', dnsRule);

    /**
     * Parsing rule to inject the DNS lookup script.
     *
     * @type {import('markdown-it').RuleCore}
     * @private
     */
    const dnsScriptRule = state => {
        if (state.inlineMode) return;

        // Check if we need to inject the script
        if (state.env.dns && state.env.dns.tokenized && !state.env.dns.injected) {
            // Set that we've injected it
            state.env.dns.injected = true;

            // Inject the token
            const token = new state.Token('html_block', '', 0);
            token.content = '<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>\n';
            state.tokens.push(token);
        }
    };

    md.core.ruler.push('dns_script', dnsScriptRule);

    /**
     * Rendering rule for DNS lookup markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.dns = (tokens, index) => {
        const token = tokens[index];

        // Construct the fallback URL
        const url = new URL('https://www.digitalocean.com/community/tools/dns');
        url.searchParams.append('domain', token.dns.domain);

        // Return the HTML
        return `<div data-dns-tool-embed data-dns-domain="${md.utils.escapeHtml(token.dns.domain)}" data-dns-types="${md.utils.escapeHtml(token.dns.types)}">
    <a href="${url.toString()}" target="_blank">
        Perform a full DNS lookup for ${md.utils.escapeHtml(token.dns.domain)}
    </a>
</div>\n`;
    };
};
