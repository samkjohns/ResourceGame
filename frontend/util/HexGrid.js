function HexGrid(rows, cols) {
  this._grid = new Array(rows);
  this.rows = rows;
  this.cols = cols;
  for (var i = 0; i < this._grid.length; i++) {
    this._grid[i] = new Array(cols);

    // initialize values
    for (var j = 0; j < this._grid[i].length; j++) {
      this._grid[i][j] = {};
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

HexGrid.prototype.onEdge = function (row, col) {
  var r, c;
  if (!col) {
    r = row[0];
    c = row[1];

  } else {
    r = row;
    c = col;
  }

  var lastR = this.rows - 1;
  var lastC = this.cols - 1;

  return r === 0 || c === 0 || r === lastR || c === lastC;
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

// returns an object of directions --> [row, col] coordinates
HexGrid.prototype.neighborsOf = function (row, col) {
  var neighbors = {};

  var coords = col % 2 === 0 ? _evenNeighborCoords : _oddNeighborCoords;
  Object.keys(coords).forEach(function (key) {
    var gridCoords = HexGrid.addPoints([row, col], coords[key]);
    if (this.inBounds(gridCoords[0], gridCoords[1])) {
      neighbors[key] = this.valueAt(gridCoords);
    }
  }.bind(this));

  return neighbors;
};

// returns an array of [row, col] coordinates
HexGrid.prototype.neighborCoords = function (row, col) {
  var coords = col % 2 === 0 ? _evenNeighborCoords : _oddNeighborCoords;
  return Object.keys(coords).map(function (key) {
    return HexGrid.addPoints(coords[key], [row, col]);
  }).filter(function (point) {
    return this.inBounds(point[0], point[1]);
  }.bind(this));
};

HexGrid.prototype.neighborTiles = function (row, col) {
  var self = this;
  var tiles = [];
  var coords = col % 2 === 0 ? _evenNeighborCoords : _oddNeighborCoords;

  Object.keys(coords).forEach(function (dir) {
    var point = HexGrid.addPoints(coords[dir], [row, col]);
    // if (point[0] === undefined || point[1] === undefined || point[0] < 0 || point[1] < 0) {
    //   console.log('direction: ' + dir);
    //   console.log('coords[dir]: ' + coords[dir]);
    //   console.log(`... + [${row}, ${col}]: ${point}`);
    //   // debugger
    // }
    if (self.inBounds(point[0], point[1])) {
      tiles.push(self.valueAt(point));
    }
  });

  return tiles;
};

HexGrid.prototype.areNeighbors = function (v1, v2, v3, v4) {
  var p1, p2;
  if (!v3) {
    p1 = v1;
    p2 = v2;

  } else {
    p1 = [v1, v2];
    p2 = [v3, v4];
  }

  return this.neighborCoords(p1).some(function (neighbor) {
    return neighbor[0] === p2[0] && neighbor[1] === p2[1];
  });
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
    // console.log(`row ${startRow} --> row ${endRow}`);
    // console.log(`col ${startCol} --> col ${endCol}`);

    for (var i = startRow; i < endRow; i++) {
      for (var j = startCol; j < endCol; j++) {
        // if (this.inBounds(i, j)) {
        var hex;
        if (i < 0 || j < 0){
          hex = null;
        } else {
          hex = this._grid[i][j];
        }
        callback(hex, i, j);
        // }
      }
    }
  }

};

HexGrid.prototype.filter = function (callback, bounds) {
  var output = [];

  this.forEach(function (tile, i, j) {
    if (callback(tile, i, j)) {
      output.push({
        tile: tile,
        row: i,
        col: j
      });
    }
  }, bounds);

  return output;
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
