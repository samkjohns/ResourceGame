var AppDispatcher = require('../dispatcher/Dispatcher.js'),
    Store = require('flux/utils').Store;

var DetailStore = new Store(AppDispatcher);

var detail = {};

function receiveDetailFocus(focus) {
  detail = focus;
}

function detailFocus() {
  return detail;
}

DetailStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case 'DETAIL_FOCUS_RECEIVED':
      receiveDetailFocus(payload.focus);
      DetailStore.__emitChange();
      break;
  }
};
