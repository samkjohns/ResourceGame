var helpers = require('../util/helpers.js');

// location is an object
//   grid: HexGrid
//   tile: tile object
//   point: [row, col]
// populations is an object of creature type --> number
function Settlement(location, populations) {
  this.image = window.resourceImages.icons.settlement;

  this.location = location;
  this.territory = [];
  this.territorySet = {};

  location.grid
    .neighborCoords(location.point[0], location.point[1])
    .forEach(this.addToTerritory.bind(this));

  this.population_counts = populations;
  this.total_population = Object.keys(populations).reduce(
    function (sum, type) {
      return sum + populations[type];
    }, 0
  );

  this.resources = {};
  this.countResources();
}

Settlement.prototype.toString = function () {
  return `Settlement with ${this.total_population} total population`;
};

Settlement.prototype.inTerritory = function (point) {
  var row = point[0], col = point[1];
  if (!this.territorySet[row] || !this.territorySet[row][col]) {
    return false;
  }
};

Settlement.prototype.addToTerritory = function (point) {
  if (!this.inTerritory(point)) {
    var row = point[0], col = point[1];
    this.territorySet[row] = this.territorySet[row] || {};
    this.territorySet[row][col] = true;
    this.territory.push(point);

    this.location.tile.territoryOf = this;
  }
};

Settlement.prototype.goldRate = function () {
  return this.total_population;
};

Settlement.prototype.countResources = function () {
  var self = this;
  self.territory.forEach(function (point) {
    var tile = self.location.grid.valueAt(point);
    var resource = tile.resource;
    if (resource) {
      self.resources[resource] = self.resources[resource] || 0;
      self.resources[resource]++;
    }

    // all tiles have a food count (min is 0)
    self.resources.food = self.resources.food || 0;
    self.resources.food += tile.food;
  });
};

Settlement.prototype.growthRate = function () {
  const saltK = 1.5;
  var foodCount = this.resources.food || 0;
  var saltCount = this.resources.salt || 0;

  var saltMult = 1 + (saltK * saltCount);

  return (3 * foodCount * saltMult) / this.total_population;
};

Settlement.prototype.weightedRandomPopulation = function () {
  var weights = [];
  var running_sum = 0;
  var populations = Object.keys(this.population_counts);

  for (var i = 0; i < populations.length; i++) {
    var population = populations[i];
    running_sum += this.population_counts[population];
    weights[i] = running_sum;
  }


  return helpers.weightedRandomChoice(populations, weights) || "";
};

Settlement.prototype.grow = function () {
  var gNum = this.growthRate();

  for (var i = 0; i < gNum; i++) {
    var pop = this.weightedRandomPopulation();
    this.population_counts[pop]++;
  }

  this.total_population += gNum;
};

module.exports = Settlement;
