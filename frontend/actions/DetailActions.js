var AppDispatcher = require('../dispatcher/Dispatcher');

var DetailActions = module.exports = {
  updateDetail: function (focus) {
    AppDispatcher.dispatch({
      actionType: 'DETAIL_FOCUS_RECEIVED',
      focus: focus
    });
  }
};
