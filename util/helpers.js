/*
Copyright 2023 DigitalOcean

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
 * Deduplicate an array.
 *
 * @param {any[]} arr Array to deduplicate.
 * @returns {any[]}
 * @private
 */
module.exports.dedupeArray = arr => Array.from(new Set(arr));

/**
 * Ensure a value is an array, wrapping it if it is not.
 *
 * @param {any|any[]} val Value to ensure is an array.
 * @returns {any[]}
 * @private
 */
module.exports.alwaysArray = val => (Array.isArray(val) ? val : [ val ]);

/**
 * Escape a string for use in a RegExp.
 *
 * @param {string} string String to escape.
 * @returns {string}
 * @private
 */
module.exports.regexEscape = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
