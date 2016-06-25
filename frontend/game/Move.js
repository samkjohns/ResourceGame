var Helpers = require('../util/helpers');

var defaultOptions = {
  range: 1,
  damage: 1
};

function Move(options) {
  Helpers.objectMerge(
    this,
    Helpers.objectUnion(defaultOptions, options)
  );
}

window.Move = Move;
module.exports = Move;
