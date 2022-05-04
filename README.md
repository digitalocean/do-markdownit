# do-markdownit

Markdown-It plugin for the DigitalOcean Community.

This plugin is what we use across the
[DigitalOcean Community](https://www.digitalocean.com/community) site to extend the standard
functionality of Markdown with additional features, such as automatic code syntax highlighting,
video embeds, and more.

You can see this plugin in action and try it out on our
[Markdown sandbox page](https://www.digitalocean.com/community/markdown).


## Getting Started

Install Markdown-It and the plugin:

```shell
npm install markdown-it @digitalocean/do-markdownit
```

Instantiate Markdown-It and the plugin, and render some Markdown:

```js
const md = require('markdown-it')({}).use(require('@digitalocean/do-markdownit'), {});

md.render('# Hello, world!\n\n<$>[info]do-markdownit is loaded!<$>');
```


## Plugin Features & Options

do-markdownit is composed of a set of individual plugins, with the ability to disable each if
needed, and many having specific options that can be set. All plugins are enabled by default.

<!--
The headings below should match the order they are loaded in the plugin.
The information under each heading should match the main JSDoc comment for each plugin.
-->

### highlight

Add support for highlight markup across all Markdown, including inside code.

The syntax for highlighting text is `<^>`. E.g. `<^>hello world<^>`.
This syntax is treated as regular inline syntax, similar to bold or italics.
However, when used within code the opening and closing tags must be on the same line.

**Example Markdown input:**

    <^>test<^>

    ```
    hello
    world
    <^>test<^>
    ```

**Example HTML output:**

    <p><mark>test</mark></p>

    <pre><code>hello
    world
    <mark>test</mark>
    </code></pre>

**Options:**

Pass options for this plugin as the `highlight` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### user_mention

Add support for mentioning users, using an `@` symbol. Wraps the mention in a link to the user.

By default, any characters that are not a space or newline after an `@` symbol will be treated as a mention.

**Example Markdown input:**

    Hello @test

**Example HTML output:**

    <p>Hello <a href="/users/test">@test</a></p>

**Options:**

Pass options for this plugin as the `user_mention` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `pattern` (`RexExp`, optional): A pattern to match user mentions, applied to the string after the `@` symbol.
- `path` (`function(string): string`, optional): A function to get the URL path for a user mention.

### html_comment

Removes all HTML comments from Markdown.

This treats HTML comments as Markdown syntax, so expects them to either be inline, or a full block.
Comments that start inline and then span a block will not be removed.

By default, removal is loose, meaning that it does not need to explicitly find the end of a comment to remove it.
If no closing mark is found, the end of the line or block is assumed.
This behaviour can be disabled with the `strict` setting, which will require finding the end of the comment.

**Example Markdown input:**

    Hello <!-- comment --> world

**Example HTML output:**

    <p>Hello  world</p>

**Options:**

Pass options for this plugin as the `html_comment` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `strict` (`boolean`, optional, defaults to `false`): If the end of a comment must be explicitly found.

### callout

Add support for callout embeds in Markdown, as block syntax.

The basic syntax is `<$>[<class>]<text><$>`. E.g. `<$>[hello]world<$>`.
The class must be in square brackets, and must come immediately after the opening `<$>`.
Newlines are allowed in the text, as is any other Markdown syntax (both block and inline).

Callouts can also have a label set within them. The label should be in the format `[label <text>]`.
The label must be on the first newline after the opening `<$>`.
The label cannot contain any newlines, but does support inline Markdown syntax.

**Example Markdown input:**

    <$>[info]
    test
    <$>

    <$>[info]
    [label hello]
    world
    <$>

**Example HTML output:**

    <div class="info">
    <p>test</p>
    </div>

    <div class="info">
    <p class="callout-label">hello</p>
    <p>world</p>
    </div>

**Options:**

Pass options for this plugin as the `callout` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `allowedClasses` (`string[]`, optional): List of case-sensitive classes that are allowed. If not an array, all classes are allowed.
- `extraClasses` (`string[]`, optional, defaults to `[]`): List of extra classes to apply to a callout div, alongside the given class.
- `labelClass` (`string`, optional, defaults to `'callout-label'`): Class to use for the label.

### rsvp_button

Add support for RSVP buttons in Markdown, as inline syntax.

The basic syntax is `[rsvp_button <marketo id>]`. E.g. `[rsvp_button 12345]`.
Optionally, a title can be set for the button in double quotes after the id. E.g. `[rsvp_button 12345 "My Button"]`.
The button title is limited to 50 characters, and can contain spaces.

The buttons are disabled by default and do not have any event listeners.
Once rendered, you should bind your own event listeners and enable the buttons.

You can find all the buttons in the DOM by looking for the `data-js` attribute being set to `rsvp-button`.
The Marketo form Id will be set as the `data-form-id` attribute.

**Example Markdown input:**

    [rsvp_button 12345 "button title"]

**Example HTML output:**

    <p><button data-js="rsvp-button" data-form-id="12345" disabled="disabled" class="rsvp">button title</button></p>

**Options:**

Pass options for this plugin as the `rsvp_button` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `className` (`string`, optional, defaults to `'rsvp'`): Class to use for the button.

### glob

Add support for [glob](https://www.digitalocean.com/community/tools/glob) embeds in Markdown, as block syntax.

The basic syntax is `[glob <pattern> <strings>]`. E.g. `[glob *.js a.js b.js c.css]`.
After the pattern, strings can be provided on a single line, or each separated by a newline.
If a newline is included, the full first line will be treated as the pattern, including any spaces.

**Example Markdown input:**

    [glob *.js /]

    [glob * test.js
    /a
    /b]

**Example HTML output:**

    <div data-glob-tool-embed data-glob-string="*.js" data-glob-test-0="/">
        <a href="https://www.digitalocean.com/community/tools/glob?glob=*.js&tests=%2F" target="_blank">
            Explore <code>*.js</code> as a glob string in our glob testing tool
        </a>
    </div>

    <div data-glob-tool-embed data-glob-string="* test.js" data-glob-test-0="/a" data-glob-test-1="/b">
        <a href="https://www.digitalocean.com/community/tools/glob?glob=*+test.js&tests=%2Fa&tests=%2Fb" target="_blank">
            Explore <code>* test.js</code> as a glob string in our glob testing tool
        </a>
    </div>
    <script async defer src="https://do-community.github.io/glob-tool-embed/bundle.js" type="text/javascript" onload="window.GlobToolEmbeds()"></script>

**Options:**

Pass options for this plugin as the `glob` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### dns

Add support for [DNS lookup](https://www.digitalocean.com/community/tools/dns) embeds in Markdown, as block syntax.

The basic syntax is `[dns <domain>]`. E.g. `[dns digitalocean.com]`.
After the domain, one or more space-separated DNS record types can be added. The default type is `A`.

**Example Markdown input:**

    [dns digitalocean.com]

    [dns digitalocean.com A AAAA]

**Example HTML output:**

    <div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A">
        <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
            Perform a full DNS lookup for digitalocean.com
        </a>
    </div>

    <div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A,AAAA">
        <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
            Perform a full DNS lookup for digitalocean.com
        </a>
    </div>
    <script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>

**Options:**

Pass options for this plugin as the `dns` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### asciinema

Add support for [Asciinema](http://asciinema.org/) embeds in Markdown, as block syntax.

The basic syntax is `[asciinema <id>]`. E.g. `[asciinema 325730]`.
The cols and rows can optionally be set using `[asciinema <id> [cols] [rows]]`. E.g. `[asciinema 325730 100 50]`.
The default value for cols is 80, and for rows is 24.

**Example Markdown input:**

    [asciinema 325730]

**Example HTML output:**

    <script src="https://asciinema.org/a/325730.js" id="asciicast-325730" async data-cols="80" data-rows="24"></script>
    <noscript>
        <a href="https://asciinema.org/a/325730" target="_blank">View asciinema recording</a>
    </noscript>

**Options:**

Pass options for this plugin as the `asciinema` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### codepen

Add support for [CodePen](https://codepen.io/) embeds in Markdown, as block syntax.

The basic syntax is `[codepen <user> <hash>]`. E.g. `[codepen AlbertFeynman gjpgjN]`.
After the user and hash, assorted space-separated flags can be added (in any combination/order):

- Add `lazy` to set the CodePen embed to not run until the user interacts with it.
- Add `dark` to set the CodePen embed to use dark mode.
- Add `html` to set the CodePen embed to default to the HTML tab.
- Add `css` to set the CodePen embed to default to the CSS tab.
- Add `js` to set the CodePen embed to default to the JavaScript tab.
- Add `editable` to set the CodePen embed to allow the code to be edited (requires the embedded user to be Pro).
- Add any set of digits to set the height of the embed (in pixels).

If any two or more of `html`, `css`, and `js` are added, HTML will be preferred, followed by CSS, then JavaScript.

**Example Markdown input:**

    [codepen AlbertFeynman gjpgjN]

    [codepen AlbertFeynman gjpgjN lazy dark 512 html]

**Example HTML output:**

    <p class="codepen" data-height="256" data-theme-id="light" data-default-tab="result" data-user="AlbertFeynman" data-slug-hash="gjpgjN" style="height: 256px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
        <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
    </p>

    <p class="codepen" data-height="512" data-theme-id="dark" data-default-tab="html" data-user="AlbertFeynman" data-slug-hash="gjpgjN" data-preview="true" style="height: 512px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
        <span>See the Pen <a href="https://codepen.io/AlbertFeynman/pen/gjpgjN">gjpgjN by AlbertFeynman</a> (<a href="https://codepen.io/AlbertFeynman">@AlbertFeynman</a>) on <a href='https://codepen.io'>CodePen</a>.</span>
    </p>
    <script async defer src="https://static.codepen.io/assets/embed/ei.js" type="text/javascript"></script>

**Options:**

Pass options for this plugin as the `codepen` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### glitch

Add support for [Glitch](https://glitch.com/) embeds in Markdown, as block syntax.

The basic syntax is `[glitch <slug>]`. E.g. `[glitch hello-digitalocean]`.
After the slug, some space-separated flags can be added (in any combination/order):

- Add `noattr` to tell Glitch to not show the authors of the project.
- Add `code` to set the Glitch embed to show the project code by default.
- Add `notree` to set the Glitch embed to collapse the file tree by default.
- Add any set of digits to set the height of the embed (in pixels).

**Example Markdown input:**

    [glitch hello-digitalocean]

    [glitch hello-digitalocean code 512 notree]

**Example HTML output:**

    <div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
        <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
            <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
        </iframe>
    </div>

    <div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
        <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=0&sidebarCollapsed=true" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
            <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
        </iframe>
    </div>

**Options:**

Pass options for this plugin as the `glitch` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### youtube

Add support for [YouTube](http://youtube.com/) embeds in Markdown, as block syntax.

The basic syntax is `[youtube <id>]`. E.g. `[youtube iom_nhYQIYk]`.
Height and width can optionally be set using `[youtube <id> [height] [width]]`. E.g. `[youtube iom_nhYQIYk 380 560]`.
The default value for height is 270, and for width is 480.

**Example Markdown input:**

    [youtube iom_nhYQIYk]

**Example HTML output:**

    <iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="380" width="560" frameborder="0" allowfullscreen>
        <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
    </iframe>

**Options:**

Pass options for this plugin as the `youtube` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### terminal_button

Add support for terminal buttons in Markdown, as block syntax.

The basic syntax is `[terminal <image name>]`. E.g. `[terminal ubuntu:focal]`.
An optional button title can be provided after the image name. E.g. `[terminal ubuntu:focal Start Terminal]`.

The buttons are disabled by default and do not have any event listeners.
Once rendered, you should bind your own event listeners and enable the buttons.

You can find all the buttons in the DOM by looking for the `data-js` attribute being set to `terminal`.
The image name will be set as the `data-docker-image` attribute.

**Example Markdown input:**

    [terminal ubuntu:focal button title]

**Example HTML output:**

    <button data-js="terminal" data-docker-image="ubuntu:focal" disabled="disabled" class="terminal">
        button title
    </button>

**Options:**

Pass options for this plugin as the `terminal_button` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### fence_label

Add support for label markup at the start of a fence, translating to a label div before the fence.

Markup must be at the start of the fence, though may be preceded by other metadata markup using square brackets.

**Example Markdown input:**

    ```
    [label test]
    hello
    world
    ```

**Example HTML output:**

    <div class="code-label" title="test">test</div>
    <pre><code>hello
    world
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_label` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `className` (`string`, optional, defaults to `'code-label'`): Class name to use on the label div.

### fence_secondary_label

Add support for secondary label markup at the start of a fence, translating to a label div inside the fence.

Markup must be at the start of the fence, though may be preceded by other metadata markup using square brackets.

**Example Markdown input:**

    ```
    [secondary_label test]
    hello
    world
    ```

**Example HTML output:**

    <pre><code><div class="secondary-code-label" title="test">test</div>hello
    world
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_secondary_label` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `className` (`string`, optional, defaults to `'secondary-code-label'`): Class name to use on the label div.

### fence_environment

Add support for environment markup at the start of a fence, translating to a class.

Markup must be at the start of the fence, though may be preceded by other metadata markup using square brackets.

**Example Markdown input:**

    ```
    [environment test]
    hello
    world
    ```

**Example HTML output:**

    <pre><code class="environment-test">hello
    world
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_environment` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `allowedEnvironments` (`string[]`, optional): List of case-sensitive environments that are allowed. If not an array, all environments are allowed.
- `extraClasses` (`string`, optional, defaults to `''`): String of extra classes to set when an environment is used.

### fence_prefix

Add support for a prefix to be set for each line on a fenced code block.

The prefix is set as part of the 'info' provided immediately after the opening fence.

The custom prefix can be set by:

- Adding the 'line_numbers' flag to the info.
  This will set each line's prefix to be incrementing line numbers.

- Adding the 'command' flag to the info.
  This will set each line's prefix to be a '$' character.
  This will also add the 'bash' flag to the info, which can be used for language highlighting.

- Adding the 'super_user' flag to the info.
  This will set each line's prefix to be a '#' character.
  This will also add the 'bash' flag to the info, which can be used for language highlighting.

- Adding the 'custom_prefix(<prefix>)' flag to the info.
  `<prefix>` can be any string that does not contain spaces. Use `\s` to represent spaces.
  This will also add the 'bash' flag to the info, which can be used for language highlighting.

**Example Markdown input:**

    ```custom_prefix(test)
    hello
    world
    ```

**Example HTML output:**

    <pre><code class="prefixed custom_prefix language-bash"><ol><li data-prefix="test">hello
    </li><li data-prefix="test">world
    </li></ol>
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_prefix` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `delimiter` (`string`, optional, defaults to `','`): String to split fence information on.

### fence_pre_attrs

Move all attributes from the opening `code` tag of a fenced code block to the `pre` tag.

**Example Markdown input:**

    ```js
    hello
    world
    ```

**Example HTML output:**

    <pre class="language-js"><code>hello
    world
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_pre_attrs` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._

### fence_classes

Filters classes on code and pre tags in fences.

**Example Markdown input:**

    ```test
    hello
    world
    ```

    ```bad
    hello
    world
    ```

**Example HTML output:**

    <pre><code class="language-test">hello
    world
    </code></pre>

    <pre><code class="">hello
    world
    </code></pre>

**Options:**

Pass options for this plugin as the `fence_classes` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `allowedClasses` (`string[]`, optional): List of case-sensitive classes that are allowed. If not an array, all classes are allowed.

### heading_id

Apply Ids to all rendered headings and generate an array of headings.

Headings are available after a render via `md.headings`.
Each item in the array is an object with the following properties:

- `slug`: The slug Id given to the heading (e.g. `my-heading`).
- `content`: The raw Markdown content of the heading (e.g. `My **Heading**`).
- `text`: The plain-text content of the heading (e.g. `My Heading`).
- `rendered`: The rendered HTML content of the heading (e.g. `My <strong>Heading</strong>`).

**Example Markdown input:**

    # Hello World!

**Example HTML output:**

    <h1 id="hello-world">Hello World!</h1>

**Options:**

Pass options for this plugin as the `heading_id` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `sluggify` (`function(string): string`, optional): Custom function to convert heading content to a slug Id.

### prismjs

Apply PrismJS syntax highlighting to fenced code blocks, based on the language set in the fence info.

This loads a custom PrismJS plugin to ensure that any existing HTML markup inside the code block is preserved.
This plugin is similar to the default `keep-markup` plugin, but works in a non-browser environment.

**Example Markdown input:**

    ```nginx
    server {
        try_files test =404;
    }
    ```

**Example HTML output:**

    <pre class="language-nginx"><code class="language-nginx"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">try_files</span> test =404</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    </code></pre>

**Options:**

Pass options for this plugin as the `prismjs` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `delimiter` (`string`, optional, defaults to `','`): String to split fence information on.


## PrismJS

As well as this plugin being for Markdown-It, we also include a modified version of PrismJS as part
of the package, wrapped and modified in such a way that it will avoid polluting the global or window
scopes with a Prism instance. Instead, each plugin or component for Prism expects to be called with
a Prism instance passed to it.

```js
const Prism = require('@digitalocean/do-markdownit/vendor/prismjs');

require('@digitalocean/do-markdownit/vendor/prismjs/plugins/toolbar/prism-toolbar')(Prism);
require('@digitalocean/do-markdownit/vendor/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard')(Prism);

Prism.highlightAll();
```

### Keep HTML plugin

Alongside the modified version of Prism, this package also includes a custom Prism plugin designed
to preserve HTML within code that is highlighted by Prism. This is similar to Prism's default Keep
Markdown plugin, but has no dependency on being run in a browser context with the DOM available.

When this plugin is enabled, it will handle preserving any HTML that is present within the code when
Prism highlights it, including the lower-level `Prism.highlight` method that takes a string of code.
Enabling this plugin will also ensure that the standard Keep Markdown plugin is disabled, so that it
does not conflict with this plugin.

```js
const Prism = require('@digitalocean/do-markdownit/vendor/prismjs');

require('@digitalocean/do-markdownit/util/prism_keep_html')(Prism);

Prism.highlight('console.log("<mark>Hello, world!</mark>");', Prism.languages.javascript, 'javascript');
```


## Contributing

### Development

To get started working with this repository, clone it locally first. Ensure that you have the
correct version of Node.js as specified in the `.nvmrc` file, and then install the dependencies
following the lockfile by running `npm ci`.

We have two key directories that contain plugins in this repository -- `modifiers` and `rules`.

The `modifiers` directory contains plugins that modify the output of existing Markdown-It render
functions, manipulating the rendered HTML results or wrapping existing parsing and rendering rules
in the core library.

The `rules` directory contains plugins that add net-new syntax rules to the Markdown-It parser, both
inline and block. Within this is the `embeds` subdirectory, which contains plugins that add what we
call embed extensions to Markdown, such as embedding a CodePen, YouTube video, etc.

Every plugin that is written should also have tests written for it, ensuring that it functions as
expected. As well as isolated tests, example usage of the plugin should be added to
`fixtures/full-input.md` to test the plugin when integrated into the main package (the plugin should
be loaded in `index.js`).

This repo makes use of Jest to run all the tests, and you can run the full suite with `npm test`.

We also make use of ESLint to enforce a consistent style of code, as well as checking that JSDoc
comments are present with valid types and descriptions. You can run the linter with `npm run lint`.

### Pull Requests & Issues

We welcome contributions to this repository in the form of pull requests or issues -- requesting or
adding new features, reporting or fixing bugs in existing plugins, cleaning up code, adding more
tests, etc.

However, please keep in mind that ultimately this plugin is built for the DigitalOcean Community,
and so we may not be able to accept every new feature that is proposed. We recommend opening an
issue first if you're interested in contributing a new feature, so that we can check it would be in
scope for the plugin before you put time into the development of it.

When opening a pull request, please make sure to fill out the provided template, making it clear
what your pull request is changing and why it is doing that. Include examples of how your changes
behave in the pull request, through example Markdown syntax and what the resultant HTML is.


## License

This plugin is licensed under the [Apache License 2.0](LICENSE).

Copyright 2022 DigitalOcean.
