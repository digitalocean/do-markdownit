'use strict';

const safeObject = require('./util/safe_object');

/**
 * @typedef {Object} DoMarkdownItOptions
 * @property {false} [highlight] Disable highlight syntax.
 * @property {false|import('./rules/user_mention').UserMentionOptions} [user_mention] Disable user mentions, or set options for the feature.
 * @property {false|import('./rules/html_comment').HtmlCommentOptions} [html_comment] Disable HTML comment stripping, or set options for the feature.
 * @property {false|import('./rules/embeds/callout').CalloutOptions} [callout] Disable callout block syntax, or set options for the feature.
 * @property {false|import('./rules/embeds/rsvp_button').RsvpButtonOptions} [rsvp_button] Disable RSVP buttons, or set options for the feature.
 * @property {false} [glob] Disable glob embeds.
 * @property {false} [dns] Disable DNS lookup embeds.
 * @property {false} [asciinema] Disable Asciinema embeds.
 * @property {false} [codepen] Disable Codepen embeds.
 * @property {false} [youtube] Disable YouTube embeds.
 * @property {false|import('./rules/embeds/terminal_button').TerminalButtonOptions} [terminal_button] Disable terminal buttons, or set options for the feature.
 * @property {false|import('./modifiers/fence_label').FenceLabelOptions} [fence_label] Disable fence labels, or set options for the feature.
 * @property {false|import('./modifiers/fence_secondary_label').FenceSecondaryLabelOptions} [fence_secondary_label] Disable fence secondary labels, or set options for the feature.
 * @property {false|import('./modifiers/fence_environment').FenceEnvironmentOptions} [fence_environment] Disable fence environments, or set options for the feature.
 * @property {false|import('./modifiers/fence_prefix').FencePrefixOptions} [fence_prefix] Disable fence prefixes, or set options for the feature.
 * @property {false} [fence_pre_attrs] Disable fence pre attributes, or set options for the feature.
 * @property {false|import('./modifiers/fence_classes').FenceClassesOptions} [fence_classes] Disable fence class filtering, or set options for the feature.
 * @property {false|import('./modifiers/heading_id').HeadingIdOptions} [heading_id] Disable Ids on headings, or set options for the feature.
 * @property {false|import('./modifiers/prismjs').PrismJsOptions} [prismjs] Disable Prism highlighting, or set options for the feature.
 */

/**
 * Inject all parts of the DigitalOcean community MarkdownIt plugin.
 *
 * @type {import('markdown-it').PluginWithOptions<DoMarkdownItOptions>}
*/
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

  // Register rules

  if (options.highlight !== false)
    md.use(require('./rules/highlight'), safeObject(options.highlight));

  if (options.user_mention !== false)
    md.use(require('./rules/user_mention'), safeObject(options.user_mention));

  if (options.html_comment !== false)
    md.use(require('./rules/html_comment'), safeObject(options.html_comment));

  // Register embeds

  if (options.callout !== false)
    md.use(require('./rules/embeds/callout'), safeObject(options.callout));

  if (options.rsvp_button !== false)
    md.use(require('./rules/embeds/rsvp_button'), safeObject(options.rsvp_button));

  if (options.glob !== false)
    md.use(require('./rules/embeds/glob'), safeObject(options.glob));

  if (options.dns !== false)
    md.use(require('./rules/embeds/dns'), safeObject(options.dns));

  if (options.asciinema !== false)
    md.use(require('./rules/embeds/asciinema'), safeObject(options.asciinema));

  if (options.codepen !== false)
    md.use(require('./rules/embeds/codepen'), safeObject(options.codepen));

  if (options.youtube !== false)
    md.use(require('./rules/embeds/youtube'), safeObject(options.youtube));

  if (options.terminal_button !== false)
    md.use(require('./rules/embeds/terminal_button'), safeObject(options.terminal_button));

  // Register modifiers

  if (options.fence_label !== false)
    md.use(require('./modifiers/fence_label'), safeObject(options.fence_label));

  if (options.fence_secondary_label !== false)
    md.use(require('./modifiers/fence_secondary_label'), safeObject(options.fence_secondary_label));

  if (options.fence_environment !== false)
    md.use(require('./modifiers/fence_environment'), safeObject(options.fence_environment));

  if (options.fence_prefix !== false)
    md.use(require('./modifiers/fence_prefix'), safeObject(options.fence_prefix));

  if (options.fence_pre_attrs !== false)
    md.use(require('./modifiers/fence_pre_attrs'), safeObject(options.fence_pre_attrs));

  if (options.fence_classes !== false)
    md.use(require('./modifiers/fence_classes'), safeObject(options.fence_classes));

  if (options.heading_id !== false)
    md.use(require('./modifiers/heading_id'), safeObject(options.heading_id));

  if (options.prismjs !== false)
    md.use(require('./modifiers/prismjs'), safeObject(options.prismjs));
};
