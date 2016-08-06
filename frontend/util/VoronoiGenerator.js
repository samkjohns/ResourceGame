var HexGrid = require('./HexGrid.js'),
    HexUtil = require('./HexUtil.js'),
    Types = require('../constants/types.js'),
    breadthFirstPath = require('../util/PathFinder.js'),
    helpers = require('./helpers.js');

function randomType() {
  var typeIdx = helpers.randInRange(0, Types.all.length);
  return Types.all[typeIdx];
}

function validPlacement(point, others, min, max) {
  for (var i = 0; i < others.length; i++) {
    var other = others[i];
    var d = helpers.distance(point, other);
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
      origin: origin,
      distance: helpers.distance(point, origin.point),
      type: origin.type
    };
  });
}

function placeBorderMountains(grid) {
  var borderTiles = [];
  var links = {};

  grid.forEach(function (tile, i, j) {
    var neighbors = grid.neighborTiles(i, j);
    var borderZone = null;
    var origin = null;
    var isBorder = neighbors.some(function (neighbor) {
      var neitherWater = neighbor.type !== 'water' && tile.type !== 'water';
      if (neitherWater && neighbor._zone !== tile._zone) {
        borderZone = neighbor._zone;
        origin = tile._zone;
        return true;
      }
      return false;
    });

    if (isBorder) {
      var originJSON = JSON.stringify(origin);
      var borderJSON = JSON.stringify(borderZone);
      links[originJSON] = links[originJSON] || {};
      links[borderJSON] = links[borderJSON] || {};
      links[originJSON][borderJSON] = true;
      links[borderJSON][originJSON] = true;

      borderTiles.push(grid.valueAt(i, j));
    }
  });

  borderTiles.forEach(function (tile) {
    tile.type = 'mountain';
  });

  linkZones(grid, links);
}

// links:
//    [0, 0]: { [10, 10]: true, [4, 4]: true },
//    [10, 10]: { [0, 0]: true },
//    [4, 4]: { [0, 0]: true }
function linkZones(grid, links) {
  // zoneJSONs:   [ '[0, 0]', '[10, 10]', '[4, 4]' ]
  var zoneJSONs = Object.keys(links);

  zoneJSONs.forEach(function (zoneJSON) {
    // zone: [0, 0]
    var zone = JSON.parse(zoneJSON);

    // linkedZones:   { [10, 10]: true, [4, 4]: true }
    var linkedZones = Object.keys(links[zoneJSON]);

    linkedZones.forEach(function (borderJSON) {
      // border: [10, 10]
      var border = JSON.parse(borderJSON);

      if (links[zoneJSON][borderJSON]) {
        var path = breadthFirstPath(
          grid, zone.point, border.point,
          function () { return false; }
        );

        path.forEach(
          function (point) {
            var tile = grid.valueAt(point);
            if (tile.type === 'mountain') {
              tile.type = zone.type;
            }
          }
        );

        // remove this link so we don't visit it again
        links[zoneJSON][borderJSON] = false;
        links[borderJSON][zoneJSON] = false;
      }
    });
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
  var zones = {};

  grid.forEach(function (hex, i, j) {
    var distances = distancesFromOrigin([i, j], origins).sort(
      function (d1, d2) {
        if (d1.distance < d2.distance) return -1;
        if (d1.distance > d2.distance) return 1;
        return 0;
      }
    );

    var origin = distances[0].origin;
    hex.type = distances[0].type;
    hex._zone = origin;
    hex.discovered = true; // for testing

    var zoneJSON = JSON.stringify(origin);
    var hexJSON = JSON.stringify([i, j]);
    zones[zoneJSON] = zones[zoneJSON] || {};
    zones[zoneJSON][hexJSON] = true;
  });

  placeBorderMountains(grid);

  return {
    grid: grid,
    zones: zones,
    origins: origins
  };
}

module.exports = generateVoronoi;
