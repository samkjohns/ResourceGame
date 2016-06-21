function HexGrid(rows, cols) {
  this._grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;
  for (var i = 0; i < this._grid.length; i++) {
    this._grid[i] = new Array(cols);

    // initialize values
    for (var j = 0; j < this._grid[i].length; j++) {
      this._grid[i][j] = null;
    }
  }
}

HexGrid.addPoints = function (p1, p2) {
  return [
    p1[0] + p2[0],
    p1[1] + p2[1]
  ];
};

HexGrid.prototype.valueAt = function (row, col) {
  if (col) {
    return this._grid[row][col];
  } return this._grid[row[0]][row[1]];
}

HexGrid.prototype.inBounds = function (row, col) {
  return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
}

var _neighborCoords = {
  NW: [0, -1],
  N: [-1, 0],
  NE: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1]
};

HexGrid.prototype.neighborsOf = function (row, col) {
  var neighbors = {};

  Object.keys(_neighborCoords).forEach(function (key) {
    var gridCoords = HexGrid.addPoints([row, col], _neighborCoords[key]);
    neighbors[key] = this.valueAt(gridCoords);
  }.bind(this));

  return neighbors;
};

HexGrid.prototype.southWestOf = function (row, col) {
  return this.neighborsOf(row, col).SW;
};

HexGrid.prototype.southOf = function (row, col) {
  return this.neighborsOf(row, col).S;
};

HexGrid.prototype.southEastOf = function (row, col) {
  return this.neighborsOf(row, col).SE;
};

HexGrid.prototype.northWestOf = function (row, col) {
  return this.neighborsOf(row, col).NW;
};

HexGrid.prototype.northOf = function (row, col) {
  return this.neighborsOf(row, col).N;
};

HexGrid.prototype.northEastOf = function (row, col) {
  return this.neighborsOf(row, col).NE;
};

HexGrid.prototype.forEach = function (callback) {
  console.log("in forEach");
  this._grid.forEach(function (row, rowIdx) {
    // debugger
    row.forEach(function (hex, colIdx) {
      // debugger
      callback(hex, rowIdx, colIdx);
    });
  });
};

module.exports = HexGrid;
