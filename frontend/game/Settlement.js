var helpers = require('../util/helpers.js');
var types = require('../constants/types.js');

// location is an object
//   grid: HexGrid
//   tile: tile object
//   point: [row, col]
// populations is an object of creature etype --> ptype --> number
//   water: {
//    fish: 10,
//    beast: 2,
//    bird: 1
//  },
//  earth: {
//    energy: 5,
//    humanoid: 10
//  }
//  ...

function Settlement(location, nPop) {
  // this.image = window.resourceImages.icons.settlement;

  this.location = location;
  this.territory = [];
  this.territorySet = {};

  // location.grid
  //   .neighborCoords(location.point[0], location.point[1])
  //   .forEach(this.addToTerritory.bind(this));

  // this.population_counts = populations;
  // this.total_population = Object.keys(populations).reduce(
    // function (sum, type) {
      // return sum + populations[type];
    // }, 0
  // );

  this.weights = types.occurrenceRates[location.tile.type];
  var populations = {};
  this.total_population = 0;
  nPop = nPop || 100;
  for (let i = 0; i < nPop; i++) {
    let c = this.weightedRandomPopulation();

    populations[c.elemental] = populations[c.elemental] || {population: 0};
    let elemPop = populations[c.elemental];
    elemPop[c.physical] = elemPop[c.physical] || 0;

    elemPop[c.physical]++;
    elemPop.population++;
    this.total_population++;
  }
  this.populations = populations;

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

function chooseElemType(rates) {
  var eWeights = [];
  var runningSum = 0;
  var eTypes = types.creatures;
  var pTypes = types.physical;

  for (let i = 0; i < eTypes.length; i++) {
    var eType = eTypes[i];
    var pRates = rates[eType];
    var pTotal = pTypes.reduce(function (sum, ptype) {
      return sum + pRates[ptype];
    }, 0);
    runningSum += pTotal;
    eWeights[i] = runningSum;
  }

  return helpers.weightedRandomChoice(eTypes, eWeights, 30);
}

function choosePhysType(rates, elemType) {
  var pWeights = [];
  var pRates = rates[elemType];
  var runningSum = 0;
  var pTypes = types.physical;


  for (let i = 0; i < pTypes.length; i++) {
    var pType = pTypes[i];
    runningSum += pRates[pType];
    pWeights[i] = runningSum;
  }

  return helpers.weightedRandomChoice(pTypes, pWeights, runningSum);
}

Settlement.prototype.weightedRandomPopulation = function () {
  var eType = chooseElemType(this.weights);
  var pType = choosePhysType(this.weights, eType);

  return {
    elemental: eType,
    physical: pType
  };
};

Settlement.prototype.grow = function () {
  var gNum = this.growthRate();

  for (var i = 0; i < gNum; i++) {
    var pop = this.weightedRandomPopulation();
    this.population_counts[pop]++;
  }

  this.total_population += gNum;
};

Settlement.prototype.recruitableCreatures = function () {
  var self = this;
  var eTypes = types.creatures;
  var pTypes = types.physical;
  var creatures = [];
  // all creatures whose (identical) pops are over 10
  for (let i = 0; i < eTypes.length; i++) {
    let etype = eTypes[i];
    let elemPop = this.populations[etype];
    if (elemPop.population >= 10) {
      for (let j = 0; j < pTypes.length; j++) {
        let ptype = pTypes[j];
        let pop = elemPop[ptype];
        if (pop >= 10) {
          creatures.push({
            elemental: etype,
            physical: ptype,
            num: pop - 9
          });
        }
      }
    }
  }

  return creatures;
};

var s = new Settlement({
  tile: {type: 'swamp'},
  point: [0, 0],
  grid: null
});
console.log(s);
console.log(s.recruitableCreatures());

module.exports = Settlement;
