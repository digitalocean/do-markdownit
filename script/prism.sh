#!/bin/sh

set -e -u -o pipefail

echo "Vendoring and patching PrismJS to avoid global/window pollution..."

# Clean out existing vendor-ed PrismJS
rm -rf vendor/prismjs

# Fetch latest PrismJS source
FILE=$(npm pack prismjs -q)
FILE_DIR="vendor/prismjs"

# Extract PrismJS
mkdir -p $FILE_DIR
tar -xzf $FILE -C $FILE_DIR
rm $FILE

# Locate the inner directory
FILE_DIR_INNER=$(find $FILE_DIR -type d -mindepth 1 -maxdepth 1 -print | head -n1)

# Move up a directory
mv $FILE_DIR_INNER/* $FILE_DIR
rm -rf $FILE_DIR_INNER

# Remove all minified JS
find $FILE_DIR -type f -name '*.min.js' -exec rm {} +

# Run the patch script
node script/prism.js
