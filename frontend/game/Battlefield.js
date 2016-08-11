var HexGrid = require('../util/HexGrid.js'),
    HexUtil = require('../util/HexUtil.js'),
    helpers = require('../util/helpers.js');

function Battlefield(attackingParty, defendingParty, tileType) {
  this.attackingParty = attackingParty;
  this.defendingParty = defendingParty;

  this.grid = new HexGrid(15, 25);
  this.grid.forEach(function (hex, i, j) {
    this.grid.setValue([i, j], {
      type: tileType
    });
  }.bind(this));
}

Battlefield.EDGE_LENGTH = 30;
Battlefield.HALF_EDGE = 15;
Battlefield.SIDE_THREE = Math.sqrt(3) * Battlefield.HALF_EDGE;

function rowFor(grid, party, idx) {
  const step = grid.rows / party.length;
  return Math.floor(idx * step);
};

Battlefield.prototype._placeParties = function () {
  var self = this;

  this.attackingParty.forEach(function (crt, idx) {
    let row = rowFor(self.grid, self.attackingParty, idx);
    self.grid.valueAt(row, 0).creature = crt;
  });

  this.defendingParty.forEach(function (crt, idx) {
    let row = rowFor(self.grid, self.defendingParty, idx);
    self.grid.valueAt(row, self.cols - 1).creature = crt;
  });
};

Battlefield.prototype.render = function (ctx) {
  var self = this;
  var drawnLines = {};
  var drawnHexes = {};

  var vertices;
  var startX = 10;
  var startY = 10 + Battlefield.SIDE_THREE;
  var currentWest = [startX, startY];

  this.grid.forEach(function (hex, rowIdx, colIdx) {
    vertices = HexUtil.drawHex(
      ctx, currentWest, hex, Battlefield.EDGE_LENGTH,
      rowIdx, colIdx, self.grid.rows, self.grid.cols,
      drawnLines, drawnHexes,
      helpers.getShowAll.bind(null, false)
    );

    let upper = 0;
    let right = self.grid.cols;
    currentWest = HexUtil.nextWest(
      currentWest, rowIdx, colIdx,
      upper, right, startX, startY,
      Battlefield.SIDE_THREE, vertices
    );

  }.bind(this));
};

module.exports = Battlefield;
