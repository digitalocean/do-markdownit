/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/**
 * Find an embed block within the given lines, starting at the first line, returning the closing index.
 *
 * @param {string[]} lines Lines of Markdown to parse.
 * @param {string} type Type of embed to find.
 * @returns {false|number}
 * @private
 */
module.exports = (lines, type) => {
    // Perform some basic checks to ensure the block is valid
    if (lines.length < 3) return false; // [type + content + ]
    if (lines[0] !== `[${type}` && !lines[0].startsWith(`[${type} `)) return false;

    // Attempt to find the closing bracket for this, allowing bracket pairs inside
    let closingIndex = -1;
    let open = 0;
    for (let i = 1; i < lines.length; i += 1) {
        // If we found an opening bracket that isn't closed on the same line, increase the open count
        if (lines[i][0] === '[') {
            let openLine = 1;
            for (let j = 1; j < lines[i].length; j += 1) {
                if (lines[i][j] === '[') openLine += 1;
                if (lines[i][j] === ']') openLine -= 1;
                if (openLine === 0) break;
            }

            if (openLine !== 0) open += 1;
        }

        // If we found a closing bracket, check if we're at the same level as the opening bracket
        if (lines[i] === ']') {
            if (open === 0) {
                closingIndex = i;
                break;
            }
            open -= 1;
        }
    }

    return closingIndex === -1 ? false : closingIndex;
};
