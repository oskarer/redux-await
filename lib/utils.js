'use strict';

exports.__esModule = true;
var isPromise = function isPromise(obj) {
  return obj && typeof obj.then === 'function';
};
exports.isPromise = isPromise;
var getPromiseKeys = function getPromiseKeys(obj) {
  return Object.keys(obj).filter(function (key) {
    return isPromise(obj[key]);
  });
};

exports.getPromiseKeys = getPromiseKeys;
var resolveProps = function resolveProps(obj) {
  var props = Object.keys(obj);
  var values = props.map(function (prop) {
    return obj[prop];
  });

  return Promise.all(values).then(function (resolvedArray) {
    return props.reduce(function (acc, prop, index) {
      acc[prop] = resolvedArray[index];
      return acc;
    }, {});
  });
};

exports.resolveProps = resolveProps;
var getNonPromiseProperties = function getNonPromiseProperties(obj) {
  return Object.keys(obj).filter(function (key) {
    return !isPromise(obj[key]);
  }).reduce(function (acc, key) {
    acc[key] = obj[key];
    return acc;
  }, {});
};

exports.getNonPromiseProperties = getNonPromiseProperties;
// taken from babel helper, we don't need to cover this
/* istanbul ignore next */
var objectWithoutProperties = function objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;

    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
};
exports.objectWithoutProperties = objectWithoutProperties;