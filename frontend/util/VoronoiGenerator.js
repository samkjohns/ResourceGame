var HexGrid = require('./HexGrid.js'),
    HexUtil = require('./HexUtil.js'),
    Types = require('../constants/types.js'),
    helpers = require('./helpers.js');

function distance(p1, p2) {
  var xDiff = p1[0] - p2[0];
  var yDiff = p1[1] - p2[1];

  var xSquare = xDiff * xDiff;
  var ySquare = yDiff * yDiff;

  return Math.sqrt(xSquare + ySquare);
}

function randomType() {
  var typeIdx = helpers.randInRange(0, Types.all.length);
  return Types.all[typeIdx];
}

function validPlacement(point, others, min, max) {
  for (var i = 0; i < others.length; i++) {
    var other = others[i];
    var d = distance(point, other);
    if (!helpers.between(d, min, max)) {
      return false;
    }
  }

  return true;
}

function getOrigins(grid, nPoints, min, max) {
  var origins = [];
  var rows = grid.rows;
  var cols = grid.cols;

  for (var i = 0; i < nPoints; i++) {
    var rX = helpers.randInRange(0, cols);
    var rY = helpers.randInRange(0, rows);
    var point = [rX, rY];

    while(!validPlacement(point, origins, min, max)) {
      rX = helpers.randInRange(0, cols);
      rY = helpers.randInRange(0, rows);
      point = [rX, rY];
    }

    origins.push(point);
  }

  return origins.map(function (origin) {
    return { point: origin, type: randomType() };
  });
}

function distancesFromOrigin(point, origins) {
  return origins.map(function (origin) {
    return {
      distance: distance(point, origin.point),
      type: origin.type
    };
  });
}

function generateVoronoi(rows, cols, nPlayers) {
  var grid = new HexGrid(rows, cols);

  var nZones = (nPlayers * 2) + helpers.randInRange(3, 5);

  var minDistance = 5;
  var maxDistance = Math.ceil(
    (rows * cols) / nZones
  );

  var origins = getOrigins(grid, nZones, minDistance, maxDistance);

  grid.forEach(function (hex, i, j) {
    var distances = distancesFromOrigin([i, j], origins).sort(
      function (d1, d2) {
        if (d1.distance < d2.distance) return -1;
        if (d1.distance > d2.distance) return 1;
        return 0;
      }
    );
    hex.type = distances[0].type;
  });

  return grid;
}

module.exports = generateVoronoi;
