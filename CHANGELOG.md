# Changelog

do-markdownit follows [Semantic Versioning](https://semver.org). Note that any new features to the
plugin will be shipped as minor releases, in that they are adding new functionality to the plugin.
New features will be enabled by default, and may change how your input Markdown is parsed. Any
breaking changes to the options supported by the plugin will be shipped as a breaking change.


## Unreleased changes

<!--
All changes being submitted through PRs should be added to this section.

Please add a new list item below this comment with a summary of the change,
leaving two line-breaks between the final item and the next heading.

Each list item should be prefixed with `(patch)`, `(minor)`, or `(major)`.
Any non-code changes should be prefixed with `(docs)`.

See `PUBLISH.md` for instructions on how to publish a new version.
-->

- (minor) Add Collapsible Heading plugin


## v1.14.0 - 3a842c4

- (minor) Use shared toolbar for code block label + buttons


## v1.13.0 - 6056063

- (patch) Dependency updates
- (minor) Add link attributes plugin


## v1.12.6 - b59f604

- (patch) Fix multi-line inline code styling


## v1.12.5 - fc90098

- (patch) Fix inline code styling when in a link


## v1.12.4 - 12a3af3

- (patch) Dependency updates


## v1.12.3 - 29b268b

- (docs) Update PUBLISH + CHANGELOG instructions for new versions
- (patch) Align code-block line numbers to the right


## v1.12.2 - 081867e

- (patch) Avoid slowdown from `URL#searchParams` in glob embed


## v1.12.1 - 39a3836

- (patch) Fix ReDoS in glob embed rule regex
- (patch) Dependency updates
- (patch) Mark markdown-it as a peer dependency


## v1.12.0 - d1542c7

- (minor) Add border to code block


## v1.11.0 - 900599c

- (minor) New design system colors


## v1.10.0 - 578e09b

- (patch) Dependency updates
- (minor) Generate TypeScript definitions for package
- (patch) Dependency updates


## v1.9.0 - 5515d0c

- (minor) Allow logging for Prism to be toggled
- (patch) Manually track loaded Prism components


## v1.8.0 - aaf8532

- (patch) Dependency updates
- (patch) Isolate Prism webpack logic in own file
- (minor) Add util to restrict Prism bundle in Webpack


## v1.7.1 - ddeb4ff6

- (patch) Fix clipboard write in heading_id hash links


## v1.7.0 - 4847d9ae

- (docs) Fix README heading ordering, add missing heading_id opts
- (minor) Hash link position, heading link + clipboard settings


## v1.6.1 - 2a2cda5

- (patch) Dependency updates
- (patch) Replace Slimdom with htmlparser2-related packages


## v1.6.0 - 03138f3

- (minor) Add Limit tokens plugin
- (minor) Add Image Compare embeds
- (minor) Add Slideshow embeds
- (minor) Add Instagram embeds
- (minor) Add Vimeo embeds


## v1.5.1 - 2f1f346

- (patch) Dependency updates


## v1.5.0 - c7be411

- (minor) Add Twitter embeds
- (minor) Add result tab flag to CodePen embeds
- (docs) Update CHANGELOG notes, add keywords, ignore Jest config for NPM
- (minor) Add hash links to heading_id plugin
- (minor) Add syntax for defining settings on images, such as size and alignment
- (patch) Dependency updates


## v1.4.0 - 1d4c368

- (patch) Reduce embed count in demo content, list supported flags
- (minor) Add modifier to enable underline syntax


## v1.3.3 - 21ac6ca

- (patch) Set aspect-ratio on YouTube/Wistia, responsiveness fixes
- (patch) Remove minified versions of patched Prism files


## v1.3.2 - a395a43

- (patch) Set position relative on root styles for z-index


## v1.3.1 - c3b57ee

- (patch) Fix styling of inline code within a link


## v1.3.0 - 5daa1ad

- (minor) Expose heading levels in heading_id
- (minor) Add Wistia embeds


## v1.2.1 - b4f0f23

- (patch) Fix block detection with links at start of line


## v1.2.0 - e4f2907

- (minor) Add syntax for expandable details
- (patch) Dependency updates
- (minor) Add styling for Markdown tables
- (minor) Add syntax for columns to customise layout
- (minor) Render captions for singleton images with titles


## v1.1.0 - 3cc7209

- (minor) Provide SCSS styling for Markdown
- (patch) Add development setup using Webpack
- (minor) Add support for embedding CanIUse data
- (minor) Add support for embedding Glitch projects


## v1.0.3 - 93d59c0

- (patch) Update jsdoc to mark @modules and @privates
- (patch) Fix issue with HTML preservation inside a multi-line token
- (patch) Don't inject user mentions inside links


## v1.0.2 - 149f660

- (patch) Dependency updates
- (patch) Fix heading_id plugin when encountering inline code
- (patch) Add Actions workflows to repo for linting/testing


## v1.0.1 - 599e553

- (patch) Use `require.resolve` to locate Prism for patching


## v1.0.0 - 94361b5

- (major) Initial open-source release
