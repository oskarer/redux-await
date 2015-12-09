'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./constants');

var _utils = require('./utils');

exports['default'] = function (reducer) {
  return function (state, action) {
    if (action.meta && action.meta[_constants.AWAIT_META_CONTAINER]) {
      var _state$merge;

      var _ret = (function () {
        var awaitMeta = action.meta[_constants.AWAIT_META_CONTAINER];
        var status = awaitMeta.status;

        /* istanbul ignore if */
        if (typeof state !== 'object') {
          throw new Error('redux-await only works with states which are objects');
        }

        var info = state[_constants.AWAIT_INFO_CONTAINER] || {};
        var statuses = _extends({}, info.statuses);
        var errors = _extends({}, info.errors);
        awaitMeta.promiseKeys.forEach(function (prop) {
          statuses[prop] = status;
          if (status === 'failure') {
            errors[prop] = action.payload;
          } else {
            // only unset errors prop if previously set
            if (errors[prop]) {
              errors[prop] = null;
            }
          }
        });
        var nextState = state.merge((_state$merge = {}, _state$merge[_constants.AWAIT_INFO_CONTAINER] = { statuses: statuses, errors: errors }, _state$merge));

        return {
          v: reducer(nextState, action, state)
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    return reducer(state, action);
  };
};

module.exports = exports['default'];