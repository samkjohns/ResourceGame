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

module.exports = Zone;
