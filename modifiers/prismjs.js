'use strict';

const Prism = require('../vendor/prismjs');
const components = require('../vendor/prismjs/components');

const safeObject = require('../util/safe_object');
const findTagOpen = require('../util/find_tag_open');
const findAttr = require('../util/find_attr');

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

// Load our HTML plugin
require('../util/prism_keep_html')(Prism);

const extractCodeBlock = (html, language) => {
  // Find the pre tag
  const pre = findTagOpen('pre', html);
  if (!pre) throw new Error('Pre not opened');

  // Find any existing classes
  const preTag = html.slice(pre.start, pre.end);
  const preClsPos = findAttr('class', preTag) || { start: preTag.length, end: preTag.length - 1 };
  const preCls = new Set(preTag.slice(preClsPos.start + 7, preClsPos.end - 1).split(' ').filter(Boolean));

  // Remove the original language class
  if (preCls.has(language.original)) preCls.delete(language.original);

  // Inject the clean language
  preCls.add(`language-${language.clean}`);

  // Inject classes back into the pre tag
  const preUp = `${preTag.slice(0, preClsPos.start - 1)} class="${[ ...preCls ].join(' ')}"${preTag.slice(preClsPos.end)}`;
  html = `${html.slice(0, pre.start)}${preUp}${html.slice(pre.end)}`;
  pre.end = pre.start + preUp.length;

  // Find the code tag
  const code = findTagOpen('code', html.slice(pre.end));
  if (!code) throw new Error('Code not opened');
  if (html.slice(pre.end, pre.end + code.start).trim()) throw new Error('Code not first child of pre');

  // Find the closing code tag
  const codeClose = html.slice(pre.end).lastIndexOf('</code>');
  if (codeClose === -1) throw new Error('Code not closed');

  // Find the closing pre tag
  const preClose = html.slice(pre.end + codeClose).lastIndexOf('</pre>');
  if (preClose === -1) throw new Error('Pre not closed');
  if (html.slice(pre.end + codeClose + 7, pre.end + codeClose + preClose).trim()) throw new Error('Code not only child of pre');

  // Get the HTML around the code
  const before = html.slice(0, pre.end + code.end);
  const after = html.slice(pre.end + codeClose);

  // Get the code inside the code tag
  const inside = html.slice(pre.end + code.end, pre.end + codeClose);

  return {
    before,
    inside,
    after,
  };
};

module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  const render = original => (tokens, idx, opts, env, self) => {
    // Get the token
    const token = tokens[idx];

    // Render original
    const rendered = original(tokens, idx, opts, env, self);

    try {
      // Find language from token info
      const tokenInfo = (token.info || '').split(options.deliminator || ',');
      const language = tokenInfo.map(info => {
        const clean = info.toLowerCase().trim();
        return { clean: languageAliases[clean] || clean, original: info };
      }).find(({ clean }) => languages.has(clean));

      // If no language, return original
      if (!language) return rendered;

      // Extract the code from the code block
      const { before, inside, after } = extractCodeBlock(rendered, language);

      // Load requirements for language
      const comp = components.languages[language.clean];
      if (comp.require) (Array.isArray(comp.require) ? comp.require : [ comp.require ]).forEach(loadLanguage);
      loadLanguage(language.clean);

      // Highlight the code with Prism
      const highlighted = Prism.highlight(inside, Prism.languages[language.clean], language.clean);

      // Combine
      return `${before}${highlighted}${after}`;
    } catch (err) {
      // Fallback to no Prism if render fails
      console.error('Bad Prism render occurred', err);
      return rendered;
    }
  };

  md.renderer.rules.fence = render(md.renderer.rules.fence);
};
