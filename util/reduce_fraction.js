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
 * Reduce a fraction to its lowest terms.
 *
 * @param {number} numerator Numerator of the fraction.
 * @param {number} denominator Denominator of the fraction.
 * @returns {number[]}
 */
module.exports = (numerator, denominator) => {
    let a = numerator;
    let b = denominator;
    let temp;

    while (b) {
        temp = a % b;
        a = b;
        b = temp;
    }

    return [ numerator / a, denominator / a ];
};
