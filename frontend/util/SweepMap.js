var HexGrid = require('./HexGrid');
var GridMap = require('./datastructures/GridMap');
var types = require('../constants/types');
var helpers = require('./helpers');
var priorityFirstPath = require('./PathFinder');

var temperatures = {
  0.3: [
    'desert',
    'plains',
    'swamp',
    'mountain'
  ],

  0.8: [
    'plains',
    'grass',
    'forest',
    'mountain'
  ],

  1: [
    'tundra',
    'snow',
    'forest',
    'mountain'
  ]
};

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

function closestOrigin(point, zones) {
  var distances = zones.map(function (zone) {
    var origin = zone.origin;
    var magnitude = helpers.distance(point, origin);
    return {
      magnitude: magnitude,
      zone: zone
    };
  });

  distances.sort(function (d1, d2) {
    if (d1.magnitude < d2.magnitude) return -1;
    if (d1.magnitude > d2.magnitude) return 1;
    return 0;
  });

  var closest = distances[0];
  var reach = 12 + helpers.randInRange(0, 3); // varying the reach makes coastlines less smooth
  return closest.magnitude < reach ? closest : { zone: null, magnitude: null };
}

function assignTilesToZones(grid, origins) {
  var zones = origins.map(function (origin) {
    var temp = Math.random();
    return {
      origin: origin,
      temperature: temp, // placeholder
      tiles: []
    };
  });

  grid.forEach(function (tile, i, j) {
    var closest = closestOrigin([i, j], zones);
    tile.zone = closest.zone;
    tile.zoneDistance = closest.magnitude;
    tile.zone && tile.zone.tiles.push(tile);
  });

  return zones;
}

// then do sub-Voronoi within the zones --> assign temperature? or just actual tile types
// or at least somehow assign types within a zone
function assignTypesInZone(grid, zone) {
  var tileSet;

  if (zone.temperature < 0.3) {
    tileSet = temperatures[0.3];

  } else if (zone.temperature < 0.8) {
    tileSet = temperatures[0.8];

  } else {
    tileSet = temperatures[1];
  }

  zone.tiles.forEach(function (tile) {
    var idx = Math.floor(Math.random() * tileSet.length);
    tile.type = tileSet[idx];
  });
}

function assignAllZones(grid, zones) {
  zones.forEach(assignTypesInZone.bind(this, grid));
}

// add ley lines
function placeLeyLines(grid, zones) {
  var prevZone, zone;
  function _setLeyLine(point) { grid.valueAt(point).leyLine = true; }

  for (var i = 1; i < zones.length; i++) {
    zone = zones[i];
    prevZone = zones[i - 1];

    var line = priorityFirstPath(grid, zone.origin, prevZone.origin, function () { return false; });
    line.forEach(_setLeyLine);
  }
}

function neighborCounts(grid, i, j) {
  var counts = {};
  var neighbors = grid.neighborTiles(i, j);

  neighbors.forEach(function (nbr) {
    if (nbr.type !== 'water') {
      counts[nbr.type] = counts[nbr.type] || 0;
      counts[nbr.type]++;
    }
  });

  return counts;
}

// change tiles that are "surrounded" by another type to that type
// 3 / 6 neighbors counts as surrounded
// this does not apply to water (should keep islands)
function consolidateTiles(grid) {
  var switches = new GridMap();

  // First create a map ('switches') of grid tiles to types they should be
  // changed to.
  grid.forEach(function (tile, i, j) {
    if (tile.type !== 'water') {

      var counts = neighborCounts(grid, i, j);
      var sorted = Object.keys(counts).sort(function (t1, t2) {
        if (counts[t1] > counts[t2]) return -1;
        if (counts[t1] < counts[t2]) return 1;
        return 0;
      });

      var highestType = sorted[0];

      if (tile.type !== highestType && counts[highestType] >= 3) {
        switches.set(i, j, highestType);
      }
    }
  });

  // Then loop over the map and switch the types
  switches.forEach(function (type, i, j) {
    var tile = grid.valueAt(i, j);
    tile.type = type;
  });
}

// main function
function sweepMapGenerator(rows, cols, nPlayers) {
  var grid = new HexGrid(rows, cols);
  var nZones = 2 + (nPlayers * 2) + helpers.randInRange(3, 5);

  placeWater(grid);
  var origins = chooseOrigins(grid, nZones);
  var zones = assignTilesToZones(grid, origins);
  assignAllZones(grid, zones);
  consolidateTiles(grid);

  placeLeyLines(grid, zones);

  return {
    grid: grid,
    zones: zones
  };
}

module.exports = sweepMapGenerator;
