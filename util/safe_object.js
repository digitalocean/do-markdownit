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
 * Check if a given value is a pure Object.
 *
 * @param {*} obj Value to check.
 * @returns {boolean}
 */
const isObject = obj => obj && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Deep clone an Object, badly.
 *
 * @param {Object} original Object to clone.
 * @returns {Object}
 */
const clone = original => Object.entries(original).reduce((target, [ key, value ]) => ({
    ...target,
    [key]: isObject(value) ? clone(value) : value,
}), {});

/**
 * Clone an Object, if given an Object, otherwise return an empty Object.
 *
 * @param {*} original Object to clone, if an Object.
 * @returns {Object}
 */
module.exports = original => (isObject(original) ? clone(original) : ({}));
