# Release publishing information

## Preparing a release

Before beginning a release, ensure that all changes intended for the release are in master, and
that all tests are passing.

Determine the greatest change (major > minor > patch) made since the last release by reviewing the
unreleased changes listed in [`CHANGELOG.md`](CHANGELOG.md).

Update the version in [`package.json`](package.json) and [`package-lock.json`](package-lock.json) by
running `npm version --no-git-tag-version <patch/minor/major>`.

Create a new branch for the release, using the version from the command, named `release-v<version>`.

Create a new heading in the [`CHANGELOG.md`](CHANGELOG.md) for the release, immediately following
the unreleased changes section. The heading should follow the format `## v<version> - <hash>`. The
hash used here should be the final (short) hash in master before the release.

Move all items in the unreleased changes section to be under the new release heading.

Commit the changes, using a message in the format `Release v<version>`, then create a PR to master
with the release branch using the same message as the title.


## Publishing a release

Once the release branch is approved and (squash) merged, ensure your local state matches master.

Create a new tag in the repository at this commit by running `git tag v<version>`. Then, push the
tag back to the repository by running `git push origin v<version>`.

Verify the tag exists in the remote repository by running `git ls-remote --tags origin`.

Run `npm publish --dry-run` to verify that the package can be published, and that all files are
included that we intend to publish.

Finally, run `npm publish` to publish the package.
