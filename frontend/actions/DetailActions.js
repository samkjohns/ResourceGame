var AppDispatcher = require('../dispatcher/Dispatcher');

var DetailActions = module.exports = {
  updateDetail: function (focus) {
    console.log('updating detail');
    AppDispatcher.dispatch({
      actionType: 'DETAIL_FOCUS_RECEIVED',
      focus: focus
    });
  }
};
