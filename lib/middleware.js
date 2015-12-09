'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('./utils');

var _constants = require('./constants');

var getPendingActionType = function getPendingActionType(type) {
  return _constants.AWAIT_MARKER + '/pending/' + type;
};
exports.getPendingActionType = getPendingActionType;
var getFailedActionType = function getFailedActionType(type) {
  return _constants.AWAIT_MARKER + '/fail/' + type;
};

exports.getFailedActionType = getFailedActionType;
var middleware = function middleware(_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      var payload = action.payload;
      var type = action.type;
      var meta = action.meta;

      if (payload && action.AWAIT_MARKER === _constants.AWAIT_MARKER) {
        var _pendingMeta, _successMeta, _failureMeta;

        (function () {

          var promiseKeys = _utils.getPromiseKeys(payload);
          var scalarValues = _utils.getNonPromiseProperties(payload);
          var pendingMeta = (_pendingMeta = {}, _pendingMeta[_constants.AWAIT_META_CONTAINER] = { promiseKeys: promiseKeys, scalarValues: scalarValues, status: 'pending' }, _pendingMeta);
          var successMeta = (_successMeta = {}, _successMeta[_constants.AWAIT_META_CONTAINER] = { promiseKeys: promiseKeys, scalarValues: scalarValues, status: 'success' }, _successMeta);
          var failureMeta = (_failureMeta = {}, _failureMeta[_constants.AWAIT_META_CONTAINER] = { promiseKeys: promiseKeys, scalarValues: scalarValues, status: 'failure' }, _failureMeta);

          var newAction = _utils.objectWithoutProperties(action, ['type', 'payload', 'AWAIT_MARKER']);

          dispatch(_extends({}, newAction, {
            type: getPendingActionType(type),
            meta: _extends({}, meta, pendingMeta, { type: type })
          }));

          var successCallback = function successCallback(payload) {
            dispatch(_extends({}, newAction, {
              type: type,
              payload: payload,
              meta: _extends({}, meta, successMeta)
            }));
          };

          var failureCallback = function failureCallback(error) {
            dispatch(_extends({}, newAction, {
              type: getFailedActionType(type),
              payload: error,
              meta: _extends({}, meta, failureMeta, { type: type })
            }));
          };

          _utils.resolveProps(payload).then(successCallback, failureCallback);
        })();
      } else {
        next(action);
      }
    };
  };
};
exports.middleware = middleware;