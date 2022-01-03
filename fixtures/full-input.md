# Title Header (H1 header)


### Introduction (H3 header)

This is some placeholder text to show examples of Markdown formatting.
We have [a full article template](https://github.com/do-community/do-article-templates) you can use when writing a DigitalOcean article.
Please refer to our style and formatting guidelines for more detailed explanations: <https://do.co/style>


## Prerequisites (H2 header)

Before you begin this guide you'll need the following:

- Familiarity with [Markdown](https://daringfireball.net/projects/markdown/)


## Step 1 — Basic Markdown

This is _italics_, this is **bold**, and this is ~~strikethrough~~.

- This is a list item.
- This list is unordered.

1. This is a list item.
2. This list is ordered.

> This is a quote.
>
> > This is a quote inside a quote.
>
> - This is a list in a quote.
> - Another item in the quote list.

Here's how to include an image with alt text and a title:

![Alt text for screen readers](https://assets.digitalocean.com/logos/DO_Logo_horizontal_blue.png "DigitalOcean Logo")

Use horizontal rules to break up long sections:

---

Rich transformations are also applied:

- On ellipsis: ...
- On quote pairs: "sammy", 'test'
- On dangling single quotes: it's
- On en/em dashes: a -- b, a --- b

<!-- Comments will be removed from the output -->

| Tables | are   | also  | supported | and    | will   | overflow | cleanly | if     | needed |
|--------|-------|-------|-----------|--------|--------|----------|---------|--------|--------|
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |
| col 1  | col 2 | col 3 | col 4     | col 5  | col 6  | col 7    | col 8   | col 9  | col 10 |


## Step 2 — Code

This is `inline code`. This is a <^>variable<^>. This is an `in-line code <^>variable<^>`.

Here's a configuration file with a label:

```nginx
[label /etc/nginx/sites-available/default]
server {
    listen 80 <^>default_server<^>;
    . . .
}
```

Examples can have line numbers, and every code block has a 'Copy' button to copy just the code:

```line_numbers,js
const test = 'hello';
const other = 'world';
console.log(test, other);
```

Here's output from a command with a secondary label:

```
[secondary_label Output]
Could not connect to Redis at 127.0.0.1:6379: Connection refused
```

This is a non-root user command example:

```command
sudo apt-get update
sudo apt-get install python3
```

This is a root command example:

```super_user
adduser sammy
shutdown
```

This is a custom prefix command example:

```custom_prefix(mysql>)
FLUSH PRIVILEGES;
SELECT * FROM articles;
```

Indicate where commands are being run with environments:

```command
[environment local]
ssh root@server_ip
```

```command
[environment second]
echo "Secondary server"
```

```command
[environment third]
echo "Tertiary server"
```

```command
[environment fourth]
echo "Quaternary server"
```

```command
[environment fifth]
echo "Quinary server"
```

And all of these can be combined together, with a language for syntax highlighting as well as a line prefix (line numbers, command, custom prefix, etc.), and even an environment and label:

```line_numbers,nginx
[environment second]
[label /etc/nginx/sites-available/default]
server {
    listen 80 <^>default_server<^>;
    . . .
}
```


## Step 3 — Callouts

Here is a note, a warning, some info and a draft note:

<$>[note]
**Note:** Use this for notes on a publication.
<$>

<$>[warning]
**Warning:** Use this to warn users.
<$>

<$>[info]
**Info:** Use this for product information.
<$>

<$>[draft]
**Draft:** Use this for notes in a draft publication.
<$>

You can also mention users by username:

@MattIPv4


## Step 4 — Embeds

Embedding a YouTube video (id, height, width):

[youtube iom_nhYQIYk 225 400]

Embedding DNS record lookups (hostname, record types...):

[dns digitalocean.com A AAAA]

Demonstrating how glob matching works (pattern, tests...):

[glob **/*.js a/b.js c/d.js e.jsx f.md]

Glob embeds can also be written as multiple lines if needed:

[glob **/*.js
a/b.js
c/d.js
e.jsx
f.md]

Embedding a CodePen example (username, pen ID, flags...):

[codepen MattCowley vwPzeX]

Setting a custom height for the CodePen:

[codepen MattCowley vwPzeX 512]

Enabling dark mode on a CodePen embed:

[codepen MattCowley vwPzeX dark]

Setting the CodePen embed to only run when clicked:

[codepen MattCowley vwPzeX lazy]

Changing the default table of a CodePen embed:

[codepen MattCowley vwPzeX css]

Making the CodePen editable by the user (requires a Pro CodePen account):

[codepen chriscoyier Yxzjdz editable]

Combining different CodePen embed flags together is also supported:

[codepen MattCowley vwPzeX dark css 384]

Embedding a terminal recording from Asciinema:

[asciinema 239367]

Setting a custom number of cols and rows for the Asciinema terminal:

[asciinema 239367 50 20]


## Step 5 — Tutorials

Certain features of our Markdown engine are designed specifically for our tutorials and are locked behind additional flags.

<p style='color: red;'>Raw HTML is supported with the `html` flag.</p>

[rsvp_button 1234 "Marketo RSVP buttons are behind the `rsvp_button` flag"]

[terminal ubuntu:focal Terminals are behind the `terminal` flag]


## Conclusion

Please refer to our [writing guidelines](https://do.co/style) for more detailed explanations on our style and formatting.
