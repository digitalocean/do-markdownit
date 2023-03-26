# Changelog

do-markdownit follows [Semantic Versioning](https://semver.org). Note that any new features to the
plugin will be shipped as minor releases, in that they are adding new functionality to the plugin.
New features will be enabled by default, and may change how your input Markdown is parsed. Any
breaking changes to the options supported by the plugin will be shipped as a breaking change.

## Unreleased changes

<!--
All changes being submitted through PRs should be added to this section.
Please add a new list item to the top of this section with a summary of the change.
Each list item should be prefixed with `(patch)` or `(minor)` or `(major)`.

Any non-code changes should be prefixed with `(docs)`.

See `PUBLISH.md` for instructions on how to publish a new version.
-->

- (minor) Add Image Compare embeds
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
