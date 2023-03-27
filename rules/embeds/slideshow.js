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
 * @module rules/embeds/slideshow
 */

/**
 * Add support for Slideshow in Markdown, as block syntax.
 *
 * The basic syntax is `[slideshow <url1> <url2> <...urls>]`. E.g., `[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png https://assets.digitalocean.com/banners/nodejs.png]`.
 * Height and width can optionally be set using `[slideshow <url1> <url2> <...urls> [height] [width]]`. E.g., `[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png https://assets.digitalocean.com/banners/nodejs.png 380 560]`.
 * The default value for height is 270 and for width is 480.
 *
 * @example
 *
 * [slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png https://assets.digitalocean.com/banners/nodejs.png]
 *
 * <div class="slideshow" style="height: 270px; width: 480px;">
 *      <div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
 *      <div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
 *      <div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /><img src="https://assets.digitalocean.com/banners/nodejs.png" alt="Slide #3" /></div>
 * </div>
 *
 * @type {import('markdown-it').PluginSimple}
 */
module.exports = md => {
    /**
     * Parsing rule for Slideshow markup.
     *
     * @type {import('markdown-it/lib/parser_block').RuleBlock}
     * @private
     */
    const slideshowRule = (state, startLine, endLine, silent) => {
        // If silent, don't replace
        if (silent) return false;

        // Get current string to consider (just current line)
        const pos = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const currentLine = state.src.substring(pos, max);

        // Perform some non-regex checks for speed
        if (currentLine.length < 13) return false; // [slideshow a]
        if (currentLine.slice(0, 11) !== '[slideshow ') return false;
        if (currentLine[currentLine.length - 1] !== ']') return false;

        // Check for slideshow match
        const match = currentLine.match(/^\[slideshow((?: \S+)+)?]$/);
        if (!match) return false;

        // Get the first image
        const options = match[1];
        if (!options) return false;

        // Get the integers for dimensions
        const numbers = options.split(' ').filter(o => o && Number.isInteger(parseInt(o, 10)));

        // Get the height
        const height = Number(numbers[0]) || 270;

        // Get the width
        const width = Number(numbers[1]) || 480;

        // Get everything that is not a simple integer
        const images = options.split(' ').filter(o => o && !Number.isInteger(parseInt(o, 10)));
        if (!images.length) {
            return false;
        }

        // Update the pos for the parser
        state.line = startLine + 1;

        // Add token to state
        const token = state.push('slideshow', 'slideshow', 0);
        token.block = true;
        token.markup = match[0];
        token.slideshow = { images, height, width };

        // Done
        return true;
    };

    md.block.ruler.before('paragraph', 'slideshow', slideshowRule);

    /**
     * Rendering rule for slideshow markup.
     *
     * @type {import('markdown-it/lib/renderer').RenderRule}
     * @private
     */
    md.renderer.rules.slideshow = (tokens, index) => {
        const token = tokens[index];
        const slides = token.slideshow.images.map((image, idx) => `<img src="${md.utils.escapeHtml(image)}" alt="Slide #${idx + 1}" />`);
        // Return the HTML
        return `<div class="slideshow" style="height: ${md.utils.escapeHtml(token.slideshow.height)}px; width: ${md.utils.escapeHtml(token.slideshow.width)}px;">
<div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= ${token.slideshow.width})()">&#8249;</div>
<div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += ${token.slideshow.width})()">&#8250;</div>
<div class="slides">${slides.join('')}</div>
</div>\n`;
    };
};
