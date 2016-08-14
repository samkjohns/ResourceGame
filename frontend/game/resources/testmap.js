var HexGrid = require('../../util/HexGrid');

const X_SIZE = 35;
const Y_SIZE = 35;

var testMap = new HexGrid(Y_SIZE, X_SIZE);
for (var i = 0; i < Y_SIZE; i++) {
  for (var j = 0; j < X_SIZE; j++) {
    testMap.setValue(
      [i, j],
      { type: "grass", object: null, creature: null, discovered: true }
    );
  }
}

module.exports = testMap;

// {
//
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:S:S:S:S:S:S:S:S:S:S:
//   G:G:G:G:G:~:~:~:~:~:~:~:~:~:~:S:S:S:S:S:
//   G:G:G:G:G:~:~:~:~:~:~:~:~:~:~:G:G:G:G:G:
//   G:G:G:G:G:~:~:~:~:~:~:~:~:~:~:G:G:G:G:G:
//   G:G:G:G:G:W:W:W:W:W:W:W:W:W:W:G:G:G:G:G:
//   P:P:P:P:P:W:W:W:W:W:W:W:W:W:W:P:P:P:P:P:
//   P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:
//   P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:
//   P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:P:
//   D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:
//   D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:D:
//   G:G:G:G:G:G:Gst:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
//   G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:G:
// }
