'use strict';

const htmlparser2 = require('htmlparser2');

const Prism = require('../vendor/prismjs');
const components = require('../vendor/prismjs/components');

const safeObject = require('../util/safe_object');

// Get languages that Prism supports
const languages = new Set(Object.keys(components.languages).filter(lang => lang !== 'meta'));
const languageAliases = Object.entries(components.languages).reduce((aliases, [ lang, { alias } ]) => {
  if (alias) (Array.isArray(alias) ? alias : [ alias ]).forEach(alias => aliases[alias] = lang);
  return aliases;
}, {});

// Helper to load in a language if not yet loaded
const loadLanguage = language => {
  if (language in Prism.languages) return;
  require(`../vendor/prismjs/components/prism-${language}`)(Prism);
};

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Render original
    const rendered = original(tokens, idx, opts, env, self);

    // Find language from token info
    const tokenInfo = (token.info || '').split(options.deliminator || ',');
    const language = tokenInfo.map(info => {
      const clean = info.toLowerCase().trim();
      return { clean: languageAliases[clean] || clean, original: info };
    }).find(({ clean }) => languages.has(clean));

    // If no language, return original
    if (!language) return rendered;

    // Load requirements for language
    const comp = components.languages[language.clean];
    if (comp.require) (Array.isArray(comp.require) ? comp.require : [ comp.require ]).forEach(loadLanguage);
    loadLanguage(language.clean);

    // Extract plain-text and any HTML from the rendered string
    let text = '';
    const data = [];
    const parser = new htmlparser2.Parser({
      onopentag(name, attributes) {
        data.push({
          type: 'open',
          name,
          attributes,
          pos: text.length,
        });
      },
      ontext(value) {
        text += value;
      },
      onclosetag(name) {
        data.push({
          type: 'close',
          name,
          pos: text.length,
        });
      },
    });
    parser.write(rendered);
    parser.end();

    // Highlight the code with Prism
    const highlighted = Prism.highlight(text, Prism.languages[language.clean], language.clean);

    // Re-inject the HTML that was previously extracted before the Prism pass
    let html = '';
    let pos = 0;
    const stack = [];

    const addOpen = ({ name, attributes }) => {
      // Add language prefix + drop tokens if first pre
      if (name === 'pre' && !stack.length) {
        const pattern = new RegExp(`\\b${language.original}\\b`);

        // Ensure the original is in the class
        if (!pattern.test(attributes.class || ''))
          attributes.class = `${attributes.class || ''} ${language.original}`.trim();

        // Replace the original with the clean + drop tokens
        attributes.class = attributes.class.replace(pattern, `language-${language.clean} drop-tokens`);
      }

      // Write to the HTML output
      html += `<${name}${Object.entries(attributes).map(([ key, value ]) => ` ${key}="${md.utils.escapeHtml(value)}"`).join('')}>`;

      // Track that we're inside this tag
      stack.push(name);
    };

    const addClose = ({ name }) => {
      // Write to the HTML output
      html += `</${name}>`;

      // Blindly pop the top tag in the stack
      stack.pop();
    };

    const parserHtml = new htmlparser2.Parser({
      onopentag(name, attributes) {
        // Inject any additional opening elements that should be before this tag
        while (data.length && data[0].pos <= pos && data[0].type === 'open') addOpen(data.shift());

        // Inject the tag itself
        addOpen({ name, attributes });
      },
      ontext(value) {
        // Track where we are within the string
        let posInt = 0;

        // Store the end position for this whole string
        const posEnd = pos + value.length;

        // Handle opening and closing any additional elements within this text
        // Allow closing tags to happen up to and after the end of the text,
        //  but only allow opening tags to happen before the end of the text
        // This ensures we don't open a tag that should open after a closing tag for the current text
        while (data.length
        && data[0].pos >= pos
        && ((data[0].type === 'open' && data[0].pos < posEnd)
          || (data[0].type === 'close' && data[0].pos <= posEnd && stack[stack.length - 1] === data[0].name))) {
          const elm = data.shift();

          // Get text before element
          const textBefore = value.slice(posInt, elm.pos - pos + posInt);
          html += md.utils.escapeHtml(textBefore);

          // Add element
          if (elm.type === 'open') addOpen(elm);
          else if (elm.type === 'close') addClose(elm);

          // Increment pos
          posInt += textBefore.length;
          pos += textBefore.length;
        }

        // Add any remaining text
        html += md.utils.escapeHtml(value.slice(posInt));
        pos += value.length - posInt;
      },
      onclosetag(name) {
        // Inject the tag itself
        addClose({ name });

        // Inject any additional closing elements that should be after this tag
        // This will only close things that are in the right order, assuming a well-formed input
        while (data.length
        && data[0].pos <= pos
        && data[0].type === 'close'
        && stack[stack.length - 1] === data[0].name) addClose(data.shift());
      },
    });
    parserHtml.write(highlighted);
    parserHtml.end();

    // Handle bad render
    if (stack.length) {
      console.error(`Bad PrismJS render, tags remain open: ${stack.join(', ')}`);
      return rendered;
    }

    // Return the new content
    return html;
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
