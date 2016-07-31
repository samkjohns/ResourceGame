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

var _oddNeighborCoords = {
  NW: [0, -1],
  N: [-1, 0],
  NE: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1]
};

var _evenNeighborCoords = {
  NW: [-1, -1],
  N: [-1, 0],
  NE: [-1, 1],
  SE: [0, 1],
  S: [1, 0],
  SW: [0, -1]
};

HexGrid.prototype.neighborsOf = function (row, col) {
  var neighbors = {};

  var coords = col % 2 === 0 ? _evenNeighborCoords : _oddNeighborCoords;
  Object.keys(coords).forEach(function (key) {
    var gridCoords = HexGrid.addPoints([row, col], _neighborCoords[key]);
    neighbors[key] = this.valueAt(gridCoords);
  }.bind(this));

  return neighbors;
};

HexGrid.prototype.neighborCoords = function (row, col) {
  var coords = col % 2 === 0 ? _evenNeighborCoords : _oddNeighborCoords;
  return Object.keys(coords).map(function (key) {
    return HexGrid.addPoints(coords[key], [row, col]);
  }).filter(function (point) {
    return this.inBounds(point[0], point[1]);
  }.bind(this));
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

HexGrid.prototype.forEach = function (callback, bounds) {
  if (!bounds) {
    this._grid.forEach(function (row, rowIdx) {
      row.forEach(function (hex, colIdx) {
        callback(hex, rowIdx, colIdx);
      });
    });

  } else {
    var startRow = bounds.upperLeft[0];
    var endRow = bounds.lowerRight[0];
    var startCol = bounds.upperLeft[1];
    var endCol = bounds.lowerRight[1];

    for (var i = startRow; i < endRow; i++) {
      for (var j = startCol; j < endCol; j++) {
        var hex = this._grid[i][j];
        callback(hex, i, j);
      }
    }
  }

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
  evnt, edgeLength, xOffset, yOffset, rowOffset, colOffset
) {
  var halfEdge = edgeLength / 2;
  var sideThree = Math.sqrt(3) * halfEdge;
  var col = Math.floor(
    (evnt.pageX - xOffset) / (edgeLength * 1.5)
  );
  col += colOffset;

  var row;
  if (col % 2 === colOffset % 2) {
    row = Math.floor(
      (evnt.pageY - yOffset - (2 * sideThree)) /
      (2 * sideThree)
    ) + 1;

  } else {
    row = Math.floor(
      (evnt.pageY - yOffset - sideThree) /
      (2 * sideThree)
    );
    row += colOffset % 2;

  }

  row = row < 0 ? 0 : row;
  row += rowOffset;

  // console.log(`[r, c]: ${row}, ${col}`);

  return {
    hex: this._grid[row][col],
    row: row,
    col: col
  };
};

// window.HexGrid = HexGrid;
module.exports = HexGrid;
