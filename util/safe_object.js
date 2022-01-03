const isObject = obj => obj && typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';

const clone = original => Object.entries(original).reduce((target, [ key, value ]) => ({
  ...target,
  [key]: isObject(value) ? clone(value) : value,
}), {});

module.exports = original => isObject(original) ? clone(original) : ({});
