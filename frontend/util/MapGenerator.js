var HexGrid = require('./HexGrid.js'),
    HexUtil = require('./HexUtil.js'),
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

  // add origin's neighbors to frontier
  // ignore neighbors that are already zoned
  var neighbors = this.grid.neighborCoords(origin[0], origin[1]);
  this.frontier =
    neighbors
      .map(function (point) {
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
  if (this.count < this.maxCount) {
    var self = this;
    var randFrontierIdx = Math.floor(Math.random() * this.frontier.length);
    var chosen = this.frontier[randFrontierIdx];

    this.inside[JSON.stringify([chosen.row, chosen.col])] = true;
    chosen.zoned = true;

    var chosenNeighbors = this.grid.neighborsOf([chosen.row, chosen.col]);
    Object.keys(chosenNeighbors).forEach(function (dir) {
      var neighbor = {
        row: neighbors[dir][0],
        col: neighbors[dir][1],
        tile: self.grid.valueAt(neigbors[dir])
      };
      var neighborJSON = JSON.stringify([neighbor.row, neighbor.col]);
      var zoned = neighbor.tile.zoned;
      var inside = self.inside[neighborJSON];
      var inFrontier = self.frontierSet[neighborJSON];

      if (!zoned && !inside && !inFrontier) {
        self.frontier.push(neighbor);
      }
    });
  }
};

Zone.prototype.linkTo = function (zone) {
  if (this.links.indexOf(zone) === -1) {
    this.links.push(zone);
    zone.links.push(this);
  }
};

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

    inter.setOrigin(midPointOf(linksWithOrigins));
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
    startingZones.push(new Zone(grid));
  }

  var nInterZones = nZones - nPlayers;
  var interZones = [];
  for (var i = 0; i < nInterZones; i++) {
    interZones.push(new Zone(grid));
  }

  linkZones(startingZones, interZones);
  setOrigins(grid, startingZones, interZones, maxCount);

  debugger
  // var zone = new Zone([3, 3], grid, maxCount);
  // zone.expand();

  return grid;
}

window.generateMap = generateMap;
module.exports = generateMap;
