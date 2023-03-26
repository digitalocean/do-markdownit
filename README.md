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

<details>
<summary>Add support for highlight markup across all Markdown, including inside code.</summary>

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
</details>

### user_mention

<details>
<summary>Add support for mentioning users, using an `@` symbol. Wraps the mention in a link to the user.</summary>

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
</details>

### html_comment

<details>
<summary>Removes all HTML comments from Markdown.</summary>

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
</details>

### image_caption

<details>
<summary>Wrap singleton images that have title text in a figure with a rendered caption.</summary>

**Example Markdown input:**

    ![alt text](test.png "title text")

    ![alt text](test.png "title text _with Markdown_")

**Example HTML output:**

    <figure><img src="test.png" alt="alt text"><figcaption>title text</figcaption></figure>

    <figure><img src="test.png" alt="alt text"><figcaption>title text <em>with Markdown</em></figcaption></figure>

**Options:**

Pass options for this plugin as the `image_caption` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### table_wrapper

<details>
<summary>Add wrapper element around Markdown `tables` for better controlled overflow.</summary>

No new syntax added. This just wraps normal Markdown `| a |` tables with a `div` that has a default
class of `table-wrapper`.

**Example Markdown input:**

    | a |
    |---|

**Example HTML output:**

    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>a</th>
                </tr>
            </thead>
        </table>
    </div>

**Options:**

Pass options for this plugin as the `table_wrapper` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `className` (`string`, optional, defaults to `'table-wrapper'`): Class to use for the table wrapper.
</details>

### callout

<details>
<summary>Add support for callout embeds in Markdown, as block syntax.</summary>

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

    <div class="callout info">
    <p>test</p>
    </div>

    <div class="callout info">
    <p class="callout-label">hello</p>
    <p>world</p>
    </div>

**Options:**

Pass options for this plugin as the `callout` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `allowedClasses` (`string[]`, optional): List of case-sensitive classes that are allowed. If not an array, all classes are allowed.
- `extraClasses` (`string[]`, optional, defaults to `['callout']`): List of extra classes to apply to a callout div, alongside the given class.
- `labelClass` (`string`, optional, defaults to `'callout-label'`): Class to use for the label.
</details>

### rsvp_button

<details>
<summary>Add support for RSVP buttons in Markdown, as inline syntax.</summary>

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
</details>

### terminal_button

<details>
<summary>Add support for terminal buttons in Markdown, as block syntax.</summary>

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
</details>

### columns

<details>
<summary>Add support for columns in Markdown, as block syntax.</summary>

To declare a column, wrap content with `[column` on the line before, and `]` on a new line at the end.
Two or more columns must be adjacent to each other to be parsed as a set of columns.

**Example Markdown input:**

    [column
    Content for the first column
    ]
    [column
    Content for the second column
    ]

**Example HTML output:**

    <div class="columns">
    <div class="column">
    <p>Content for the first column</p>
    </div>
    <div class="column">
    <p>Content for the second column</p>
    </div>
    </div>

**Options:**

Pass options for this plugin as the `columns` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `outerClassName` (`string`, optional, defaults to `'columns'`): Class to use for the outer columns container.
- `innerClassName` (`string`, optional, defaults to `'column'`): Class to use for the inner column container.
</details>

### details

<details>
<summary>Add support for expandable details in Markdown, as block syntax.</summary>

To create an expandable details section, use `[details` followed by a summary.
Content for the expanded section should be provided on lines after, closed with `]` on a new line.

**Example Markdown input:**

    [details This is hidden content
    Content for inside the expanded section
    ]

    [details open This section is *open* by default
    Content for inside the expanded section
    ]

**Example HTML output:**

    <details>
    <summary>This is hidden content</summary>
    <p>Content for inside the expanded section</p>
    </details>

    <details open>
    <summary>This section is <em>open</em> by default</summary>
    <p>Content for inside the expanded section</p>
    </details>

**Options:**

Pass options for this plugin as the `details` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### glob

<details>
<summary>Add support for <a href="https://www.digitalocean.com/community/tools/glob">glob</a> embeds in Markdown, as block syntax.</summary>

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
</details>

### dns

<details>
<summary>Add support for <a href="https://www.digitalocean.com/community/tools/dns">DNS lookup</a> embeds in Markdown, as block syntax.</summary>

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
</details>

### asciinema

<details>
<summary>Add support for <a href="http://asciinema.org/">Asciinema</a> embeds in Markdown, as block syntax.</summary>

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
</details>

### codepen

<details>
<summary>Add support for <a href="https://codepen.io/">CodePen</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[codepen <user> <hash>]`. E.g. `[codepen AlbertFeynman gjpgjN]`.
After the user and hash, assorted space-separated flags can be added (in any combination/order):

- Add `lazy` to set the CodePen embed to not run until the user interacts with it.
- Add `light` or `dark` to set the CodePen embed theme (default is `light`).
- Add `html`, `css`, or `js` to set the default tab for the CodePen embed.
- Add `result` to set the CodePen embed to default to the Result tab (default, can be combined with other tabs).
- Add `editable` to set the CodePen embed to allow the code to be edited (requires the embedded user to be Pro).
- Add any set of digits to set the height of the embed (in pixels).

If two or more tabs are selected (excluding `result`), `html` will be preferred, followed by `css`, then `js`.
If the `result` tab is selected, it can be combined with any other tab to generate a split view.

If both `light` and `dark` are selected, `dark` will be preferred.

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
</details>

### glitch

<details>
<summary>Add support for <a href="https://glitch.com/">Glitch</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[glitch <slug>]`. E.g. `[glitch hello-digitalocean]`.
After the slug, some space-separated flags can be added (in any combination/order):

- Add `noattr` to tell Glitch to not show the authors of the project.
- Add `code` to set the Glitch embed to show the project code by default.
- Add `notree` to set the Glitch embed to collapse the file tree by default.
- Add `path=` followed by a file path to set the Glitch embed to show a specific file by default.
- Add `highlights=` followed by a comma-separated list of line numbers to tell Glitch to highlight those lines.
- Add any set of digits to set the height of the embed (in pixels).

**Example Markdown input:**

    [glitch hello-digitalocean]

    [glitch hello-digitalocean code 512 notree path=src/app.jsx]

**Example HTML output:**

    <div class="glitch-embed-wrap" style="height: 256px; width: 100%;">
        <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=100" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
            <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
        </iframe>
    </div>

    <div class="glitch-embed-wrap" style="height: 512px; width: 100%;">
        <iframe src="https://glitch.com/embed/#!/embed/hello-digitalocean?previewSize=0&sidebarCollapsed=true&path=src%2Fapp.jsx" title="hello-digitalocean on Glitch" allow="geolocation; microphone; camera; midi; encrypted-media; xr-spatial-tracking; fullscreen" allowFullScreen style="height: 100%; width: 100%; border: 0;">
            <a href="https://glitch.com/edit/#!/hello-digitalocean" target="_blank">View hello-digitalocean on Glitch</a>
        </iframe>
    </div>

**Options:**

Pass options for this plugin as the `glitch` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### caniuse

<details>
<summary>Add support for <a href="https://caniuse.com/">CanIUse</a> embeds in Markdown, as block syntax.</summary>

Uses https://caniuse.bitsofco.de/ to provide interactive embeds from CanIUse data.

The basic syntax is `[caniuse <feature>]`. E.g. `[caniuse css-grid]`.
After the slug, some space-separated flags can be added (in any combination/order):

- Add `past=` followed by a number to control how many previous browser versions to include (default is 1, supported 0-5).
- Add `future=` followed by a number to control how many previous browser versions to include (default is 1, supported 0-3).
- Add `accessible` to set the default color scheme for the CanIUse embed to be accessible colors.

**Example Markdown input:**

    [caniuse css-grid]

    [caniuse css-grid past=5 future=3 accessible]

**Example HTML output:**

    <p class="ciu_embed" data-feature="css-grid" data-periods="future_1,current,past_1" data-accessible-colours="false">
        <picture>
            <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/css-grid.webp" />
            <source type="image/png" srcset="https://caniuse.bitsofco.de/image/css-grid.png" />
            <img src="https://caniuse.bitsofco.de/image/css-grid.jpg" alt="Data on support for the css-grid feature across the major browsers from caniuse.com" />
        </picture>
    </p>

    <p class="ciu_embed" data-periods="future_3,future_2,future_1,current,past_1,past_2,past_3,past_4,past_5" data-accessible-colours="true">
        <picture>
            <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/ambient-light.webp" />
            <source type="image/png" srcset="https://caniuse.bitsofco.de/image/ambient-light.png" />
            <img src="https://caniuse.bitsofco.de/image/ambient-light.jpg" alt="Data on support for the ambient-light feature across the major browsers from caniuse.com" />
        </picture>
    </p>
    <script async defer src="https://cdn.jsdelivr.net/gh/ireade/caniuse-embed@v1.3.0/public/caniuse-embed.min.js" type="text/javascript"></script>

**Options:**

Pass options for this plugin as the `caniuse` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### youtube

<details>
<summary>Add support for <a href="http://youtube.com/">YouTube</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[youtube <id>]`. E.g. `[youtube iom_nhYQIYk]`.
Height and width can optionally be set using `[youtube <id> [height] [width]]`. E.g. `[youtube iom_nhYQIYk 380 560]`.
The default value for height is 270, and for width is 480.

**Example Markdown input:**

    [youtube iom_nhYQIYk]

**Example HTML output:**

    <iframe src="https://www.youtube.com/embed/iom_nhYQIYk" class="youtube" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
        <a href="https://www.youtube.com/watch?v=iom_nhYQIYk" target="_blank">View YouTube video</a>
    </iframe>

**Options:**

Pass options for this plugin as the `youtube` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### wistia

<details>
<summary>Add support for <a href="https://wistia.com/">Wistia</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[wistia <id>]`. E.g. `[wistia 7ld71zbvi6]`.
Height and width can optionally be set using `[wistia <id> [height] [width]]`. E.g. `[wistia 7ld71zbvi6 380 560]`.
The default value for height is 270, and for width is 480.

**Example Markdown input:**

    [wistia 7ld71zbvi6]

**Example HTML output:**

    <iframe src="http://fast.wistia.net/embed/iframe/7ld71zbvi6" class="wistia" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
        <a href="http://fast.wistia.net/embed/iframe/7ld71zbvi6" target="_blank">View Wistia video</a>
    </iframe>

**Options:**

Pass options for this plugin as the `wistia` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>


### vimeo

<details>
<summary>Add support for <a href="https://vimeo.com/">Vimeo</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[vimeo <url>]`. E.g. `[vimeo https://player.vimeo.com/video/329272793]`.
Height and width can optionally be set using `[vimeo <url> [height] [width]]`. E.g. `[vimeo https://player.vimeo.com/video/329272793 380 560]`.
The default value for height is 270, and for width is 480.

**Example Markdown input:**

    [vimeo https://player.vimeo.com/video/329272793]

**Example HTML output:**

    <iframe src="https://player.vimeo.com/video/329272793" class="vimeo" height="270" width="480" style="aspect-ratio: 16/9" frameborder="0" allowfullscreen>
        <a href="https://player.vimeo.com/video/329272793" target="_blank">View vimeo video</a>
    </iframe>

**Options:**

Pass options for this plugin as the `vimeo` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### twitter

<details>
<summary>Add support for <a href="https://twitter.com/">Twitter</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[twitter <tweet>]`. E.g. `[twitter https://twitter.com/MattIPv4/status/1576415168426573825]`.
After the tweet, assorted space-separated flags can be added (in any combination/order):

- Add `light` or `dark` to set the card theme (default is `light`).
- Add `left`, `center`, or `right` to set the alignment of the embed (default is `left`).
- Add any set of digits to set the width of the embed (in pixels, between 250 and 550, default is 550).

If two or more alignments are selected, `left` will be preferred, followed by `center`, then `right`.

If both `light` and `dark` are selected, `dark` will be preferred.

If a width outside the range of 250-550 is selected, a clamped value will be used.

**Example Markdown input:**

    [twitter https://twitter.com/MattIPv4/status/1576415168426573825]

    [twitter https://twitter.com/MattIPv4/status/1576415168426573825 left 400 dark]

**Example HTML output:**

    <div class="twitter">
        <blockquote class="twitter-tweet" data-dnt="true" data-width="550" data-theme="light">
            <a href="https://twitter.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
        </blockquote>
    </div>

    <div class="twitter" align="left">
        <blockquote class="twitter-tweet" data-dnt="true" data-width="400" data-theme="dark">
            <a href="https://twitter.com/MattIPv4/status/1576415168426573825">View tweet by @MattIPv4</a>
        </blockquote>
    </div>
    <script async defer src="https://platform.twitter.com/widgets.js" type="text/javascript"></script>

**Options:**

Pass options for this plugin as the `twitter` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### instagram

<details>
<summary>Add support for <a href="https://instagram.com/">Instagram</a> embeds in Markdown, as block syntax.</summary>

The basic syntax is `[instagram <post>]`. E.g. `[instagram https://www.instagram.com/p/CkQuv3_LRgS]`.
After the post, assorted space-separated flags can be added (in any combination/order):

- Add `caption` to include caption under the post.
- Add `left`, `center`, or `right` to set the alignment of the embed (default is `left`).
- Add any set of digits to set the width of the embed (in pixels, between 326 and 550, default is 326 as set by Instagram's embed.js).

If two or more alignments are selected, `left` will be preferred, followed by `center`, then `right`.

If a width outside the range of 326-550 is selected, a clamped value will be used.

**Example Markdown input:**

    [instagram https://www.instagram.com/p/CkQuv3_LRgS]

    [instagram https://www.instagram.com/p/CkQuv3_LRgS left caption 400]

**Example HTML output:**

    <div class="instagram">
        <blockquote class="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS"
            data-instgrm-version="14">
                <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
        </blockquote>
    </div>

    <div class="instagram" align="left">
        <blockquote class="instagram-media"
            style="width: 400px;"
            data-instgrm-permalink="https://www.instagram.com/p/CkQuv3_LRgS"
            data-instgrm-version="14"
            data-instgrm-captioned>
                <a href="https://instagram.com/p/CkQuv3_LRgS">View post</a>
        </blockquote>
    </div>
    <script async defer src="https://www.instagram.com/embed.js" type="text/javascript" onload="window.instgrm && window.instgrm.Embeds.process()"></script>

**Options:**

Pass options for this plugin as the `instagram` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### slideshow

<details>
<summary>Add support for Slideshow in Markdown, as block syntax.</summary>

The basic syntax is `[slideshow <url1> <url2>]`. E.g., `[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png]`.
Height and width can optionally be set using `[slideshow <url1> <url2> [height] [width]]`. E.g., `[slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png 380 560]`.
The default value for height is 270 and for width is 480.

**Example Markdown input:**

    [slideshow https://assets.digitalocean.com/banners/python.png https://assets.digitalocean.com/banners/javascript.png]

**Example HTML output:**

    <div class="slideshow" style="height: 270px; width: 480px;">
        <div class="action left" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft -= 480)()">&#8249;</div>
        <div class="action right" onclick="(() => this.parentNode.getElementsByClassName('slides')[0].scrollLeft += 480)()">&#8250;</div>
        <div class="slides"><img src="https://assets.digitalocean.com/banners/python.png" alt="Slide #1" /><img src="https://assets.digitalocean.com/banners/javascript.png" alt="Slide #2" /></div>
    </div>

**Options:**

Pass options for this plugin as the `slideshow` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### underline

<details>
<summary>Add support for underline markup across all Markdown.</summary>

The syntax for underline text is `__`. E.g. `__hello world__`.
This replaces the default behaviour for the syntax, which would be bold.
This syntax is treated as regular inline syntax, similar to bold or italics.

**Example Markdown input:**

    __test__

**Example HTML output:**

    <p><u>test</u></p>

**Options:**

Pass options for this plugin as the `underline` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

_No options are available for this plugin._
</details>

### fence_label

<details>
<summary>Add support for label markup at the start of a fence, translating to a label div before the fence.</summary>

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
</details>

### fence_secondary_label

<details>
<summary>Add support for secondary label markup at the start of a fence, translating to a label div inside the fence.</summary>

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
</details>

### fence_environment

<details>
<summary>Add support for environment markup at the start of a fence, translating to a class.</summary>

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
</details>

### fence_prefix

<details>
<summary>Add support for a prefix to be set for each line on a fenced code block.</summary>

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
</details>

### fence_pre_attrs

<details>
<summary>Move all attributes from the opening `code` tag of a fenced code block to the `pre` tag.</summary>

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
</details>

### fence_classes

<details>
<summary>Filters classes on code and pre tags in fences.</summary>

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
</details>

### heading_id

<details>
<summary>Apply Ids to all rendered headings and generate an array of headings.</summary>

Headings are available after a render via `md.headings`.
Each item in the array is an object with the following properties:

- `slug`: The slug Id given to the heading (e.g. `my-heading`).
- `content`: The raw Markdown content of the heading (e.g. `My **Heading**`).
- `text`: The plain-text content of the heading (e.g. `My Heading`).
- `rendered`: The rendered HTML content of the heading (e.g. `My <strong>Heading</strong>`).
- `level`: The heading level (e.g. `1`).

**Example Markdown input:**

    # Hello World!

**Example HTML output:**

    <h1 id="hello-world"><a class="hash-anchor" href="#hello-world" aria-hidden="true"></a>Hello World!</h1>

**Options:**

Pass options for this plugin as the `heading_id` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `sluggify` (`function(string): string`, optional): Custom function to convert heading content to a slug Id.
- `hashLink` Set this property to `false` to disable this feature.
    - `maxLevel` (`number`, optional, defaults to `3`): Max heading level to generate hash links for.
    - `class` (`string`, optional, defaults to `hash-anchor`): Class name to use on the anchor tag.
</details>

### image_settings

<details>
<summary>Add support for defining settings on images, such as size and alignment.</summary>

The syntax for this is `{ width=<width> height=<height> align=<alignment> }`, at the end of the image markup.
E.g. `![alt](test.png "title"){ width=100 height=200 align=left }`.
All settings are optional, and the order does not matter.

By default, the width and height can be plain number (`100`), pixels (`100px`), or percentage (`100%`).
Other units can be supported by passing an array of unit strings via the `sizeUnits` option.

Alignment can be left unset, which will center the image, or can be set to either `left` or `right`.

**Example Markdown input:**

    ![alt](test.png "title"){ width=100 height=200 align=left }

**Example HTML output:**

    <p><img src="test.png" alt="alt" title="title" width="100" height="200" align="left"></p>

**Options:**

Pass options for this plugin as the `image_settings` property of the `do-markdownit` plugin options.
Set this property to `false` to disable this plugin.

- `sizeUnits` (`string[]`, optional, defaults to `['', 'px', '%']`): Image size units to allow.
</details>

### prismjs

<details>
<summary>Apply PrismJS syntax highlighting to fenced code blocks, based on the language set in the fence info.</summary>

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
</details>


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


## Styles

This package also includes a set of SCSS stylesheets aimed at providing standard styles for our
usage of Markdown within the DigitalOcean community, styling the features provided by this package
as well as styling for standard Markdown.

These are broken up by component, and can be found in the [`styles`](./styles) directory. There is
also a subdirectory within for [DigitalOcean-specific styles](./styles/digitalocean) (e.g. specific
callout classes that we use).

Example usage:

```scss
.markdown {
    @import "@digitalocean/do-markdownit/styles";
}
```

Note that if you're planning to use this in a way that will ultimately pass through Webpack's
css-loader to produce CSS modules (such as Next.js SCSS module), you may need to wrap the import in
a block using the `:global` pseudo-selector to ensure the classes inside aren't exported as well:

```scss
.markdown {
    :global {
        @import "@digitalocean/do-markdownit/styles";
    }
}
```

If you're importing this as a context where there will be no parent selector, you will need to set
`$root-text-styles` to `false` to prevent the default text styling that uses a `& {` selector from
being loaded:

_Importing the styles globally is not recommended, as these Markdown styles may collide with other
parts of your document._

```scss
$root-text-styles: false;
@import "@digitalocean/do-markdownit/styles";
```

### SCSS Variables

<!--
Variables listed here should be sorted based on the filename, and then by variable name.
-->

| Variable                                 | Default                | Usage                                                       | File                                                                |
|------------------------------------------|------------------------|-------------------------------------------------------------|---------------------------------------------------------------------|
| `$callouts-class` _(string)_             | `callout`              | The class name used for the `callout` plugin.               | [`_callouts.scss`](./styles/_callouts.scss)                         |
| `$callouts-label-class` _(string)_       | `callout-label`        | The class name used for labels in the `callout` plugin.     | [`_callouts.scss`](./styles/_callouts.scss)                         |
| `$code-label-class` _(string)_           | `code-label`           | The class name used for the `fence_label` plugin.           | [`_code_label.scss`](./styles/_code_label.scss)                     |
| `$code-secondary-label-class` _(string)_ | `secondary-code-label` | The class name used for the `fence_secondary_label` plugin. | [`_code_secondary_label.scss`](./styles/_code_secondary_label.scss) |
| `$columns-inner-class` _(string)_        | `column`               | The inner class name used for the `columns` plugin.         | [`_columns.scss`](./styles/_columns.scss)                           |
| `$columns-outer-class` _(string)_        | `columns`              | The outer class name used for the `columns` plugin.         | [`_columns.scss`](./styles/_columns.scss)                           |
| `$hash-anchor-class` _(string)_          | `hash-anchor`          | The anchor class name used for the `heading_id` plugin.     | [`_heading-id.scss`](./styles/_heading_id.scss)                     |
| `$rsvp-button-class` _(string)_          | `rsvp`                 | The class name used for the `rsvp_button` plugin.           | [`_rsvp_button.scss`](./styles/_rsvp_button.scss)                   |
| `$table-wrapper-class` _(string)_        | `table-wrapper`        | The class name used for the `table_wrapper` plugin.         | [`_table_wrapper.scss`](./styles/_table_wrapper.scss)               |
| `$terminal-button-class` _(string)_      | `terminal`             | The class name used for the `terminal_button` plugin.       | [`_terminal_button.scss`](./styles/_terminal_button.scss)           |
| `$root-text-styles` _(boolean)_          | `true`                 | Enable or disable the `& {` selector for root text styles.  | [`_typography.scss`](./styles/_typography.scss)                     |

Alongside these variables used for controlling specific styles, there is also the
[`_theme.scss`](./styles/_theme.scss) file that contains all the colors used by the package.


## Contributing

### Development

To get started working with this repository, clone it locally first. Ensure that you have the
correct version of Node.js as specified in the `.nvmrc` file, and then install the dependencies
following the lockfile by running `npm ci`.

You can then start up the demo server by running `npm run dev`. This runs a barebones instance of
Webpack with hot-reload enabled that provides a real-time input that renders to Markdown, using the
plugins in this package as well as the SCSS styling.

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

We also have the `styles` directory, which contains the SCSS files provided by the package to style
all the custom functionality this plugin provides, as well as core Markdown styles.

We also make use of ESLint and Stylelint to enforce a consistent style of code, as well as checking
that JSDoc comments are present with valid types and descriptions. You can run the linter for both
JS and SCSS with `npm run lint`, or using `npm run lint:js` and `npm run lint:scss` respectively.

Both linters also support auto-fixing some issues, and this can be invoked with `npm run lint:fix`,
or by using `npm run lint:fix:js` and `npm run lint:fix:scss` for the relevant files.

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

Copyright 2023 DigitalOcean.
