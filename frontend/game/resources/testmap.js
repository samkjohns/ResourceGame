var HexGrid = require('../../util/HexGrid');

var testMap = new HexGrid(10, 10);
for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    testMap.setValue(
      [i, j],
      { type: "grass", object: null, creature: null }
    );
  }
}

// testMap.valueAt(4, 4).obstacle = true;
// testMap.valueAt(4, 5).obstacle = true;
// testMap.valueAt(4, 6).obstacle = true;

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