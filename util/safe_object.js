'use strict';

/**
 * Check if a given value is a pure Object.
 *
 * @param {*} obj
 * @return {boolean}
 */
const isObject = obj => obj && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Deep clone an Object, badly.
 *
 * @param {Object} original
 * @return {Object}
 */
const clone = original => Object.entries(original).reduce((target, [ key, value ]) => ({
  ...target,
  [key]: isObject(value) ? clone(value) : value,
}), {});

/**
 * Clone an Object, if given an Object, otherwise return an empty Object.
 *
 * @param {*} original
 * @return {Object}
 */
module.exports = original => isObject(original) ? clone(original) : ({});
