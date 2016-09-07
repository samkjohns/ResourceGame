var types = require('../constants/types');

// Sweep 1
// first place water everywhere
function placeWater(grid) {
  grid.forEach(function (tile, i, j) {
    tile.type = 'water';
  });
}

// Sweep 2
// then choose a set number of origins at maximum
function chooseOrigins(grid, max) {
  var points = [];

  var x, y;
  while (points.length < max) {
    x = helpers.randInRange(0, grid.cols);
    y = helpers.randInRange(0, grid.rows);
    points.push([x, y]);
  }

  return points;
}

// then do Voronoi assigning, but only if a tile is within a certain distance (imperfect)
// also assign temperature?

function closestOrigin(point, origins) {
  var distances = origins.map(function (origin) {
    var magnitude = helpers.distance(point, origin);
    return {
      magnitude: magnitude,
      origin: origin
    };
  });

  distances.sort(function (d1, d2) {
    if (d1.distance < d2.distance) return -1;
    if (d1.distance > d2.distance) return 1;
    return 0;
  });

  return distances[0];
}

function assignTilesToZones(grid, origins) {
  var zones = origins.slice();
  grid.forEach(function (tile, i, j) {
    var closest = closestOrigin([i, j], origins);
    tile.zone = closest;
  });
}

// then do sub-Voronoi within the zones --> assign temperature? or just actual tile types
