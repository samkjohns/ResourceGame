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
  if (col !== undefined) {
    return this._grid[row][col];
  } return this._grid[row[0]][row[1]];
};

HexGrid.prototype.setValue = function (point, value) {
  this._grid[point[0]][point[1]] = value;
  return value;
};

HexGrid.prototype.inBounds = function (row, col) {
  return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
};

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
  this._grid.forEach(function (row, rowIdx) {
    row.forEach(function (hex, colIdx) {
      callback(hex, rowIdx, colIdx);
    });
  });
};

HexGrid.verticesFor = function (
  rowIdx, colIdx, edgeLength, xOffset, yOffset
) {
  var halfEdge = edgeLength / 2;
  var sideThree = Math.sqrt(3) * halfEdge;

  var westX = xOffset + (colIdx * (edgeLength + halfEdge));
  var westY;

  if (colIdx % 2 === 0) {
    westY = yOffset + sideThree + (rowIdx * sideThree * 2);
  } else {
    westY = yOffset + (2 * sideThree) + (rowIdx * sideThree * 2);
  }

  var startX = westX;
  var startY = westY;
  var vertices = {
    W: [westX, westY],

    NW: [
      startX + halfEdge,
      startY - sideThree
    ],

    NE: [
      startX + (halfEdge + edgeLength),
      startY - sideThree
    ],

    E: [
      startX + (2 * edgeLength),
      startY
    ],

    SW: [
      startX + halfEdge,
      startY + sideThree
    ],

    SE: [
      startX + halfEdge + edgeLength,
      startY + sideThree
    ],
  };

  return vertices;
};

HexGrid.originOf = function (
  rowIdx, colIdx, edgeLength, xOffset, yOffset
) {
  var west = HexGrid.verticesFor(
    rowIdx, colIdx, edgeLength, xOffset, yOffset
  ).W;

  return [
    west[0] + edgeLength, west[1]
  ];
};

HexGrid.prototype.clickedHex = function (
  evnt, edgeLength, xOffset, yOffset
) {
  var sideThree = Math.sqrt(3) * (edgeLength / 2);
  var clickedPoint = [evnt.pageX, evnt.pageY];
  var col = Math.floor(
    (evnt.pageX - xOffset) / (edgeLength * 1.5)
  );

  var row;
  if (col % 2 === 0) {
    row = Math.floor(
      (evnt.pageY - yOffset - (2 * sideThree)) /
      (2 * sideThree)
    ) + 1;

  } else {
    row = Math.floor(
      (evnt.pageY - yOffset - sideThree) /
      (2 * sideThree)
    );
  }
  row = row < 0 ? 0 : row;


  return {
    hex: this._grid[row][col],
    row: row,
    col: col
  };
};

window.HexGrid = HexGrid;
module.exports = HexGrid;
