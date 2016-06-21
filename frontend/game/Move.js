var Helpers = require('../util/helpers');

var defaultOptions = {

};

function Move(options) {
  Helpers.objectMerge(this, options);
}

module.exports = Move;
