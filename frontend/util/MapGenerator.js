var HexGrid = require('./HexGrid.js'),
    HexUtil = require('./HexUtil.js'),
    Types = require('../constants/types.js'),
    helpers = require('./helpers.js');

var zoneId = 0;

function Zone(grid, maxCount) {
  this.id = ++zoneId;
  this.grid = grid;

  // NB: Since the number of zones will probably not divide into the number of
  // tiles evenly, this.count can be less than maxCount by 1 when complete
  this.count = 0;
  this.maxCount = maxCount;

  // zones this is linked to
  this.links = [];
}

Zone.prototype.setOrigin = function (origin) {
  if (this.origin) throw `Already set origin`;

  this.origin = origin;
  if (!this.grid.valueAt(origin)) this.grid.setValue(origin, {});
  this.grid.valueAt(origin).zoned = true;

  // add origin's neighbors to frontier
  // ignore neighbors that are already zoned
  var neighbors = this.grid.neighborCoords(origin[0], origin[1]);
  this.frontier =
    neighbors
      .map(function (point) {
        if (!this.grid.valueAt(point)) this.grid.setValue(point, {});

        return {
          row: point[0],
          col: point[1],
          tile: this.grid.valueAt(point)
        };
      }.bind(this))
      .filter(function (neighbor) {
        return !neighbor.tile || !neighbor.tile.zoned;
      })
    ;

  // if there's no frontier, the chosen origin is isolated
  // this is a problem
  if (this.frontier.length === 0) {
    throw `Zone at origin [${origin[0]}, ${origin[1]}] is isolated`;
  }

  // the set of all points already inside the zone
  this.inside = {};
  this.inside[JSON.stringify(origin)] = true;

  // the set of all points in the frontier (for lookup)
  this.frontierSet = {};
  this.frontier.forEach(function (point) {
    var pointJSON = JSON.stringify([point.row, point.col]);
    this.frontierSet[pointJSON] = true;
  }.bind(this));
};

Zone.prototype.expand = function () {
  if (this.count < this.maxCount && this.frontier.length > 0) {
    var self = this;
    var randFrontierIdx = helpers.randInRange(0, this.frontier.length);
    var chosen = this.frontier[randFrontierIdx];
    var point = [chosen.row, chosen.col];
    if (!this.grid.valueAt(point)) this.grid.setValue(point, {});
    var chosenJSON = JSON.stringify(point);

    this.inside[chosenJSON] = true;
    this.frontierSet[chosenJSON] = false;
    this.frontier.splice(randFrontierIdx, 1);

    chosen.tile.zoned = true;
    chosen.tile.type = this.type;
    this.count++;

    var chosenNeighbors = this.grid.neighborCoords(point[0], point[1]);
    // console.log(chosenNeighbors);
    chosenNeighbors.forEach(function (nCoord) {
      if (!self.grid.valueAt(nCoord)) self.grid.setValue(nCoord, {});

      var neighbor = {
        row: nCoord[0],
        col: nCoord[1],
        tile: self.grid.valueAt(nCoord)
      };

      var neighborJSON = JSON.stringify(nCoord);
      var zoned = neighbor.tile.zoned;
      var inside = self.inside[neighborJSON];
      var inFrontier = neighbor.tile._frontier;

      if (!zoned && !inside && !inFrontier) {
        self.frontier.push(neighbor);
        self.frontierSet[neighborJSON] = true;
        neighbor.tile._frontier = true;
      }
    });

    return true;
  }

  return false;
};

Zone.prototype.linkTo = function (zone) {
  if (this.links.indexOf(zone) === -1) {
    this.links.push(zone);
    zone.links.push(this);
  }
};

// window.expandTest = function() {
//   var grid = new HexGrid(5, 5);
//   var zone = new Zone(grid, 25);
//   zone.setOrigin([0, 0]);
//   debugger
//
//   while (true) {
//     zone.expand();
//     debugger
//   }
// };

function linkZones(starting, inter) {

  // link interior zones with each other
  for (var i = 0; i < inter.length; i++) {
    var zone = inter[i];

    // guaranteed first link (unless this is the last zone)
    var others = inter.slice();
    others.splice(i, 1);
    var toLinkIdx = helpers.randInRange(0, others.length);
    var toLink = others[toLinkIdx];
    zone.linkTo(toLink);

    var chance = .3;
    if (Math.random() < chance) {
      others = others.splice(toLinkIdx, 1);
      toLinkIdx = helpers.randInRange(0, others.length);
      toLink = others[toLinkIdx];
      zone.linkTo(toLink);
    }
  }

  // now link each starting zone with 1-3 interior zones
  for (var j = 0; j < starting.length; j++) {
    var zone = starting[j];
    var interiors = inter.slice();
    var toLinkIdx = helpers.randInRange(0, interiors.length);
    var toLink = interiors[toLinkIdx];
    zone.linkTo(toLink);

    interiors.splice(toLinkIdx, 1);
    var maxExtras = interiors.length > 2 ? 2 : interiors.length;
    var extras = helpers.randInRange(0, maxExtras);
    for (var k = 0; k < extras; k++) {
      toLinkIdx = helpers.randInRange(0, interiors.length);
      toLink = interiors[toLinkIdx];
      interiors.splice(toLinkIdx, 1);
      zone.linkTo(toLink);
    }
  }
}

function edgesFor(grid) {
  return [
    {
      name: 'top',
      idx: 0,
      coords: [0, NaN]
    },

    {
      name: 'right',
      idx: 1,
      coords: [NaN, grid.cols - 1]
    },

    {
      name: 'bottom',
      idx: 0,
      coords: [grid.rows - 1, NaN]
    },

    {
      name: 'left',
      idx: 1,
      coords: [NaN, 0]
    }
  ];
}

function eachEdge(grid, callback) {
  edgesFor(grid).forEach(function (edge) {
    callback(edge);
  });
}

function getEdge(name) {
  return edgesFor(grid).find(function (edge) {
    return edge.name === name;
  });
}

function pointsOnEdge(grid, edge) {
  var filteredEdge = [];

  if (edge.idx === 0) {
    var row = edge.coords[0];
    for (var i = 0; i < grid.cols; i++) {
      var point = [row, i];
      if (!grid.valueAt(point)) grid.setValue(point, {});
      if (!grid.valueAt(point).zoned) filteredEdge.push(point);
    }

  } else {
    var col = edge.coords[1];
    for (var i = 0; i < grid.rows; i++) {
      var point = [i, col];
      if (!grid.valueAt(point)) grid.setValue(point, {});
      if (!grid.valueAt(point).zoned) filteredEdge.push(point);
    }
  }

  return filteredEdge;
}

function randPointOnEdge(grid, edge) {
  var points = pointsOnEdge(grid, edge);
  if (points.length === 0) throw `Couldn't find a valid point on that edge.`;

  var randIdx = helpers.randInRange(0, points.length);
  return points[randIdx];
}

function midPointOf(zones) {
  var origins = zones.map(function (zone) {
    return zone.origin;
  });

  var centroid = HexUtil.centroid(origins);
  return [
    Math.floor(centroid[0]),
    Math.floor(centroid[1])
  ];
}

function travelToUnoccupied(grid, point, steps) {
  console.log(`travel to: ${point[0]}, ${point[1]}`);
  if (steps === 0) return point;

  if (!grid.valueAt(point)) grid.setValue(point, {});
  grid.valueAt(point)._traveledAlong = true;

  var neighbors = grid.neighborCoords(point[0], point[1]);
  // console.log(neighbors.length);
  // debugger
  var unoccupied = neighbors.filter(function (neighbor) {
    if (!grid.valueAt(neighbor)) grid.setValue(neighbor, {});
    var nHex = grid.valueAt(neighbor);
    return !nHex.zoned && !nHex._traveledAlong;
  });

  if (unoccupied.length === 0) {
    console.log("returned early because there were no options");
    return point;
  }

  var rIdx = helpers.randInRange(0, unoccupied.length);
  var nextPoint = unoccupied[rIdx];
  return travelToUnoccupied(grid, nextPoint, steps - 1);
}

function setOrigins(grid, starting, interior, maxCount) {
  // starting zone origins should be on edges
  var edges = edgesFor(grid);
  for (var i = 0; i < starting.length; i++) {
    var zone = starting[i];

    // find the edge with the least number of origins on it
    var sortedEdges = edges.sort(function (edge1, edge2) {
      // oCount tracks how many edges are on the edge
      edge1.oCount = edge1.oCount || 0;
      edge2.oCount = edge2.oCount || 0;
      if (edge1.oCount < edge2.oCount) return -1;
      else if(edge1.oCount > edge2.oCount) return 1;
      return 0;
    });
    var edge = sortedEdges[0];
    edge.oCount++;

    var point = randPointOnEdge(grid, edge);
    zone.setOrigin(point);
  }

  // interior origins should be evenly spaced out

  // first sort zones by number of links they have
  // this is because we'll want to start with zones with
  // a higher number of linked zones that have origins set (at least 2)
  var inters = interior.slice().sort(function (z1, z2) {
    if (z1.links.length > z2.links.length) return -1;
    if (z1.links.length < z2.links.length) return 1;
    return 0;
  });

  for (var j = 0; j < inters.length; j++) {
    var inter = inters[j];
    var linksWithOrigins = inter.links.filter(function (link) {
      return link.origin;
    });

    var linksMidpoint = midPointOf(linksWithOrigins);
    var hex = grid.valueAt(linksMidpoint);
    if (!hex || !hex.zoned) {
      inter.setOrigin(linksMidpoint);

    } else {
      var origin = travelToUnoccupied(
        grid, linksMidpoint, Math.floor(inter.maxCount / 10)
      );
      inter.setOrigin(origin);
    }
  }
}

function generateMap(rows, cols, nPlayers) {
  var grid = new HexGrid(rows, cols);

  var nZones = (nPlayers * 2) + helpers.randInRange(-1, 2);
  var maxCount = Math.ceil(
    (rows * cols) / nZones
  );

  var startingZones = [];
  for (var i = 0; i < nPlayers; i++) {
    var z = new Zone(grid, maxCount);
    var typeIdx = helpers.randInRange(0, Types.starting.length);
    var type = Types.starting[typeIdx];
    if (!type) throw `error setting type. typeIdx was ${typeIdx}`;
    z.type = type;
    startingZones.push(z);
  }

  var nInterZones = nZones - nPlayers;
  var interZones = [];
  for (var i = 0; i < nInterZones; i++) {
    var z = new Zone(grid, maxCount);
    var typeIdx = helpers.randInRange(0, Types.all.length);
    var type = Types.all[typeIdx];
    if (!type) throw `error setting type. typeIdx was ${typeIdx}`;
    z.type = type;
    interZones.push(z);
  }

  linkZones(startingZones, interZones);
  setOrigins(grid, startingZones, interZones, maxCount);

  var allZones = startingZones.concat(interZones);
  var iterCount = 0;
  while (true) {
    if (allZones.every(function (zone) {
      return zone.maxCount - zone.count <= 1;
    }) ) {
      break;
    }

    var flag = false;
    allZones.forEach(function (zone) {
      if (zone.expand()) flag = true;
    });

    if (!flag) break;
  }

  console.log('done');

  return {
    grid: grid,
    starting: startingZones,
    interior: interZones
  };
}

window.generateMap = generateMap;
module.exports = generateMap;
