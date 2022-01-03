'use strict';

const safeObject = require('./util/safe_object');

/**
 * Inject all parts of the DigitalOcean community MarkdownIt plugin
 * @param {MarkdownIt} md - The MarkdownIt instance
 * @param {Object} options - The options for the DigitalOcean community plugin parts
 * @param {boolean|Object} [options.fence_label={}] - Disable fence labels, or set options for the feature
 * @param {boolean|Object} [options.fence_secondary_label={}] - Disable fence secondary labels, or set options for the feature
 * @param {boolean|Object} [options.fence_environment={}] - Disable fence environments, or set options for the feature
 * @param {boolean|Object} [options.fence_prefix={}] - Disable fence prefixes, or set options for the feature
 * @param {boolean|Object} [options.fence_pre_attrs={}] - Disable fence pre attributes, or set options for the feature
 * @param {boolean|Object} [options.fence_classes={}] - Disable fence class filtering, or set options for the feature
 * @param {boolean|Object} [options.highlight={}] - Disable highlight syntax, or set options for the feature
 * @param {boolean|Object} [options.heading_id={}] - Disable Ids on headings, or set options for the feature
 * @param {boolean|Object} [options.user_mention={}] - Disable user mentions, or set options for the feature
 * @param {boolean|Object} [options.prismjs={}] - Disable Prism highlighting, or set options for the feature
 * @param {boolean|Object} [options.callout={}] - Disable callout block syntax, or set options for the feature
 * @param {boolean|Object} [options.rsvp_button={}] - Disable RSVP buttons, or set options for the feature
 * @param {boolean|Object} [options.glob={}] - Disable glob tool embeds, or set options for the feature
 * @param {boolean|Object} [options.dns={}] - Disable DNS tool embeds, or set options for the feature
 * @param {boolean|Object} [options.asciinema={}] - Disable Asciinema recording embeds, or set options for the feature
 * @param {boolean|Object} [options.codepen={}] - Disable CodePen editor embeds, or set options for the feature
 * @param {boolean|Object} [options.youtube={}] - Disable YouTube video embeds, or set options for the feature
 * @param {boolean|Object} [options.terminal={}] - Disable Lyceum terminal embeds, or set options for the feature
*/
module.exports = (md, options) => {
  // Get the correct options
  options = safeObject(options);

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

  if (options.highlight !== false)
    md.use(require('./modifiers/highlight'), safeObject(options.highlight));

  if (options.heading_id !== false)
    md.use(require('./modifiers/heading_id'), safeObject(options.heading_id));

  if (options.user_mention !== false)
    md.use(require('./modifiers/user_mention'), safeObject(options.user_mention));

  if (options.prismjs !== false)
    md.use(require('./modifiers/prismjs'), safeObject(options.prismjs));

  // Register embeds

  if (options.callout !== false)
    md.use(require('./embeds/callout'), safeObject(options.callout));

  if (options.rsvp_button !== false)
    md.use(require('./embeds/rsvp_button'), safeObject(options.rsvp_button));

  if (options.glob !== false)
    md.use(require('./embeds/glob'), safeObject(options.glob));

  if (options.dns !== false)
    md.use(require('./embeds/dns'), safeObject(options.dns));

  if (options.asciinema !== false)
    md.use(require('./embeds/asciinema'), safeObject(options.asciinema));

  if (options.codepen !== false)
    md.use(require('./embeds/codepen'), safeObject(options.codepen));

  if (options.youtube !== false)
    md.use(require('./embeds/youtube'), safeObject(options.youtube));

  if (options.terminal !== false)
    md.use(require('./embeds/terminal'), safeObject(options.terminal));
};
