function GridMap() {
  this.map = {};
}

var _isPoint = function (p) {
  if (p instanceof Array && p.length === 2) return true;
  return(
    typeof p === 'object' &&
    p.length && p.length === 2 &&
    p[0] && typeof p[0] === 'number' &&
    p[1] && typeof p[1] === 'number'
  );
};

GridMap.prototype.set = function (row, col, value) {
  var r, c, v;
  if (_isPoint(row)) {
    r = row[0];
    c = row[1];
    v = col;

  } else {
    r = row;
    c = col;
    v = value;
  }

  this.map[r] = this.map[r] || {};
  this.map[r][c] = this.map[r][c] || {};
  this.map[r][c] = v;

  if (r >= this.numRows) this.numRows = r + 1;
  if (c >= this.numCols) this.numCols = c + 1;
};

GridMap.prototype.get = function (row, col) {
  var r, c;
  if (_isPoint(row)) {
    r = row[0];
    c = row[1];

  } else {
    r = row;
    c = col;
  }

  if (this.map[row] && this.map[row][col]) return this.map[row][col];
  return null;
};

GridMap.prototype.has = function (row, col) {
  var r, c;
  if (_isPoint(row)) {
    r = row[0];
    c = row[1];

  } else {
    r = row;
    c = col;
  }

  return this.map[row] && this.map[row][col];
};

GridMap.prototype.count = function () {
  var c = 0;
  this.forEach(function () { c++; });
  return c;
};

GridMap.prototype.forEach = function (callback) {
  var rowKeys = Object.keys(this.map);
  var colKeys, row, col, value;
  for (var i = 0; i < rowKeys.length; i++) {
    row = parseInt(rowKeys[i]);
    colKeys = Object.keys(this.map[row]);
    // console.log(i + " " + row);
    for (var j = 0; j < colKeys.length; j++) {
      col = parseInt(colKeys[j]);
      value = this.get(row, col);
      callback(value, row, col);
    }
  }
};

GridMap.prototype.filter = function (callback) {
  var output = [];

  this.forEach(function (value, row, col) {
    if (callback(value, row, col)) {
      output.push({
        value: value,
        row: row,
        col: col
      });
    }
  });

  return output;
};

module.exports = GridMap;
