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

/**
 * @module rules/embeds/cta_banner
 */

const DEFAULT_BACKGROUND_COLOR = '#DFE8FF';
const DEFAULT_BUTTON_COLOR = '#C6E3FF';

/**
 * Checks whether the provided value is a conservative, safe CSS color string.
 *
 * This is used because we inject the color into an inline `style` attribute.
 *
 * @param {string} value - Candidate color string.
 * @returns {boolean}
 */
const isSafeCssColor = value => {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Basic keyword(s)
    if (trimmed === 'transparent') return true;

    // #RGB, #RRGGBB, #RGBA, #RRGGBBAA
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)) return true;

    // rgb()/rgba() with 0-255 or percentages, and alpha in 0..1
    if (/^rgba?\(\s*(\d{1,3}%?|\d{1,3}%?)\s*,\s*(\d{1,3}%?|\d{1,3}%?)\s*,\s*(\d{1,3}%?|\d{1,3}%?)(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/.test(trimmed)) return true;

    // hsl()/hsla() with hue (deg|grad|rad|turn|number), S/L as %, alpha in 0..1
    if (/^hsla?\(\s*\d+(?:deg|grad|rad|turn)?\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/.test(trimmed)) return true;

    // CSS variables: var(--some-name)
    if (/^var\(\s*--[a-zA-Z0-9_-]+\s*\)$/.test(trimmed)) return true;

    return false;
};

/**
 * Checks whether the provided value is a conservative, safe href for an anchor tag.
 *
 * @param {string} value - Candidate href string.
 * @returns {boolean}
 */
const isSafeHref = value => {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Conservative scheme allowlist. Relative URLs and anchors are allowed.
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
    if (trimmed.startsWith('mailto:')) return true;
    if (trimmed.startsWith('/')) return true;
    if (trimmed.startsWith('#')) return true;

    return false;
};

/**
 * Add support for CTA banners in Markdown, as block syntax.
 *
 * Supported syntax forms:
 * - `[ctaBanner "<title>" "<button_text>" "<button_link>"]`
 * - `[ctaBanner <background_color> "<title>" "<button_text>" "<button_link>"]`
 * - `[ctaBanner <background_color> "<title>" "<button_text>" "<button_link>" "<button_color>"]`
 * - `[ctaBanner <background_color> "<title>" "<button_text>" "<button_link>" "<cta_text>" "<cta_link>"]`
 * - `[ctaBanner <background_color> "<title>" "<button_text>" "<button_link>" "<button_color>" "<cta_text>" "<cta_link>"]`
 *
 * The `<background_color>` and `<button_color>` values must be safe CSS colors.
 *
 * If either color is missing or not valid, the defaults are used:
 * - background color: `#DFE8FF`
 * - button color: `#C6E3FF`
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for CTA banner markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     */
    const ctaBannerRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max).trim();

        // Perform some non-regex checks for speed
        if (currentLine.length < 24) return false; // [ctaBanner "b" "c" "d"...]
        if (currentLine.slice(0, 11) !== '[ctaBanner ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Try to match supported variants (quoted args are double-quote delimited).
        const matchNoOptional = currentLine.match(/^\[ctaBanner(?: (?!")(\S+))? "([^"]*)" "([^"]*)" "([^"]*)"\]$/);
        const matchButtonColorOnly = currentLine.match(/^\[ctaBanner(?: (?!")(\S+))? "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"\]$/);
        const matchCtaPairOnly = currentLine.match(/^\[ctaBanner(?: (?!")(\S+))? "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"\]$/);
        const matchButtonColorAndCta = currentLine.match(/^\[ctaBanner(?: (?!")(\S+))? "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"\]$/);

        if (!matchNoOptional && !matchButtonColorOnly && !matchCtaPairOnly && !matchButtonColorAndCta) return false;

        const match = matchNoOptional || matchButtonColorOnly || matchCtaPairOnly || matchButtonColorAndCta;

        const backgroundColorToken = isSafeCssColor(match[1]) ? match[1] : DEFAULT_BACKGROUND_COLOR;

        const title = match[2];
        const buttonText = match[3];
        const buttonLink = match[4];

        if (!title.trim() || !buttonText.trim() || !buttonLink.trim()) return false;
        if (!isSafeHref(buttonLink)) return false;

        let buttonColorToken = DEFAULT_BUTTON_COLOR;
        let ctaText = null;
        let ctaLink = null;

        if (matchButtonColorOnly) {
            const candidateButtonColor = matchButtonColorOnly[5];
            buttonColorToken = isSafeCssColor(candidateButtonColor) ? candidateButtonColor : DEFAULT_BUTTON_COLOR;
        } else if (matchCtaPairOnly) {
            ctaText = matchCtaPairOnly[5];
            ctaLink = matchCtaPairOnly[6];
        } else if (matchButtonColorAndCta) {
            const candidateButtonColor = matchButtonColorAndCta[5];
            buttonColorToken = isSafeCssColor(candidateButtonColor) ? candidateButtonColor : DEFAULT_BUTTON_COLOR;
            ctaText = matchButtonColorAndCta[6];
            ctaLink = matchButtonColorAndCta[7];
        }

        // If CTA is present, validate both parts.
        if (ctaText !== null || ctaLink !== null) {
            if (!ctaText || !ctaText.trim() || !ctaLink || !ctaLink.trim()) return false;
            if (!isSafeHref(ctaLink)) return false;
        }

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('cta_banner', 'cta_banner', 0);
        token.block = true;
        token.markup = currentLine;
        token.cta_banner = {
            backgroundColorToken,
            title,
            buttonText,
            buttonLink,
            buttonColorToken,
            ctaText,
            ctaLink,
        };

        return true;
    };

    md.block.ruler.before('paragraph', 'cta_banner', ctaBannerRule);

    /**
     * Rendering rule for CTA banner markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     */
    md.renderer.rules.cta_banner = (tokens, index) => {
        const token = tokens[index];
        const {
            backgroundColorToken,
            title,
            buttonText,
            buttonLink,
            buttonColorToken,
            ctaText,
            ctaLink,
        } = token.cta_banner;

        const safeBgColor = md.utils.escapeHtml(backgroundColorToken);
        const safeTitle = md.utils.escapeHtml(title);
        const safeButtonText = md.utils.escapeHtml(buttonText);
        const safeButtonLink = md.utils.escapeHtml(buttonLink);
        const safeBtnColor = md.utils.escapeHtml(buttonColorToken);

        const style = `background-color: ${safeBgColor}; --cta-button-color: ${safeBtnColor}; --cta-button-color-hover: ${safeBtnColor};`;

        const safeCtaText = ctaText ? md.utils.escapeHtml(ctaText) : null;
        const safeCtaLink = ctaLink ? md.utils.escapeHtml(ctaLink) : null;

        const ctaHtml = safeCtaText && safeCtaLink
            ? `      <a class="cta-banner-cta" href="${safeCtaLink}">${safeCtaText}</a>\n`
            : '';

        return `<div class="cta-banner" style="${style}">\n  <div class="cta-banner-inner">\n    <div class="cta-banner-content">\n      <h3 class="cta-banner-title">${safeTitle}</h3>\n${ctaHtml}    </div>\n    <a class="cta-banner-button" href="${safeButtonLink}">${safeButtonText}</a>\n  </div>\n</div>\n`;
    };
};
