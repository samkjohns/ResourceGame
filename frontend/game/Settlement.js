var helpers = require('../util/helpers.js');
var types = require('../constants/types.js');
var CreatureType = require('./CreatureType.js');
var Creature = require('./Creature.js');

// location is an object
//   grid: HexGrid
//   tile: tile object
//   point: [row, col]

// store each population as a Creature, but each one represents 100
// population grows when city collects enough food (as in Civ)
function Settlement(location, nPop) {
  window && (this.image = window.resourceImages.icons.settlement);
  this.location = location;
  this.tileType = location.tile.type;

  this.territory = [];
  this.territorySet = {};

  // commented out for testing
  location.grid && (
  location.grid
    .neighborCoords(location.point[0], location.point[1])
    .forEach(this.addToTerritory.bind(this))
  );

  this.inhabitants = [];
  this.demographics = {
    elemental: {
      fire: 0, water: 0, earth: 0, air: 0,
      storm: 0, magic: 0, plant: 0
    },
    physical: {
      beast: 0, bird: 0, humanoid: 0, energy: 0
    }
  };
  this.hybridRate = 1; // controls frequency of hybrids

  // add random creatures nPop times
  for (var i = 0; i < nPop; i++) {
    var ct = this.generateRandomSeed();
    this.inhabitants.push(ct);
    this.demographics.physical[ct.physical]++;
    types.creatures.forEach(function (etype) {
      let pcnt = ct.typePercent(etype);
      this.demographics.elemental[etype] += pcnt;
    }.bind(this));
  }

  this.recruitableCreatures = [];

  this.resources = {};
  this.countResources();
  this.growth = 0; // when this hits certain threshholds, population grows
}

/* ---------- THE FACTORY ---------- */

// generates a random creature based on the location
Settlement.prototype.generateRandomSeed = function () {
  var weights = types.occurrenceRates[this.location.tile.type];
  var etype = chooseElemType(weights);
  var ptype = choosePhysType(weights, etype);
  var etypes = {};
  etypes[etype] = 1;

  return new CreatureType(etypes, ptype);
};

// generates a random creaturetype based on demographics
// will be used for adding to inhabitants and for generating a recruitable creature
Settlement.prototype.generateRandomCreature = function () {
  var self = this;

  var pWeights = types.physical.map(function (ptype) {
    return self.demographics.physical[ptype];
  });
  var ptype = helpers.rawWeightedRandomChoice(types.physical, pWeights);

  var etypes = {};
  var remaining = types.creatures.slice();
  var remainingShare = 1;
  while (true) {

    let eWeights = remaining.map(function (etype) {
      return self.demographics.elemental[etype];
    });

    let etype = helpers.rawWeightedRandomChoice(remaining, eWeights);
    etypes[etype] = etypes[etype] || 0;

    let hybridR = helpers.randInRange(0, 5);
    if (hybridR >= this.hybridRate) {
      etypes[etype] += remainingShare;
      break;

    } else {
      let eMag = generateTypeShare(this.percentOf(etype)) * remainingShare;

      remainingShare -= eMag;
      etypes[etype] += eMag;
    }


    if (remainingShare === 0)
      break;

    // now remove etype from remaining to prevent adding it again
    let eIdx = remaining.findIndex(function (e) { return e === etype; });
    remaining.splice(eIdx, 1);
  }

  return new CreatureType(etypes, ptype);
  // return Creature.generateCreature(type);
};

/* ---------- GAME MECHANICS ---------- */

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
  return Math.floor(Math.pow(this.totalPopulation(), 1.3) * 10);
};

// determines how much to add to this.growth
Settlement.prototype.growthRate = function () {
  const saltK = .1;
  var foodCount = this.resources.food || 0;
  var saltCount = this.resources.salt || 0;

  var saltMult = 1 + (saltK * saltCount);

  return Math.floor((3 * foodCount * saltMult) / this.totalPopulation());
};

Settlement.prototype.nextGrowthThreshhold = function () {
  return this.totalPopulation() * 2;
};

Settlement.prototype.grow = function () {
  this.growth += this.growthRate();

  const threshhold = this.nextGrowthThreshhold();
  if (this.growth >= threshhold) {
    var ct = this.generateRandomCreature();

    this.inhabitants.push(ct);
    this.demographics.physical[ct.physical]++;
    Object.keys(ct.elemental).forEach(function (etype) {
      let mag = ct.typePercent(etype);
      if (mag >= .3) this.demographics.elemental[etype]++;
    }.bind(this));

    this.growth -= threshhold;
  }
};

/* ---------- CALCULATIONS ---------- */

Settlement.prototype.totalPopulation = function () {
  return this.inhabitants.length;
};

// floating point between 0, 1
Settlement.prototype.percentOf = function (stat) {
  var subName = types.physical.indexOf(stat) >= 0 ? 'physical' : 'elemental';
  var sub = this.demographics[subName];
  return sub[stat] / this.totalPopulation();
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

/* ---------- HELPER FUNCTIONS ---------- */

Settlement.prototype.toString = function () {
  var self = this;
  var s = `Population: ${this.totalPopulation()}\n`;
  s += '\nDemographics:\n';
  types.physical.forEach(function (ptype) {
    s += `\t${ptype}:\t${self.percentOf(ptype) * 100}%\n`;
  });
  s += "\n";
  types.creatures.forEach(function (etype) {
    s += `\t${etype}:\t${self.percentOf(etype) * 100}%\n`;
  });
  return s;
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

function generateTypeShare(percent) {
  var weights = [];
  const timesWhole = Math.floor(percent * 10);
  const timesNot = 10 - timesWhole;

  for (let i = 0; i < timesWhole; i++) {
    weights[i] = 1;
  }

  var i = 9;
  for (let s = 0; s < timesNot; s++) {
    let m = parseFloat((s / timesNot).toFixed(2));
    weights[i] = m || .1;
    i--;
  }

  const r = helpers.randInRange(0, 10);
  return weights[r];
}

// var s = new Settlement({ tile: {type: 'swamp' }}, 10);
// console.log(s);
// console.log("\n-------\n");
// console.log(s.generateRandomCreature());

module.exports = Settlement;

/*

Settlement.prototype.getHybrid = function () {

};

Settlement.prototype.interbreed = function () {
  for (var i = 0; i < this.hybridRate; i++) {
    var c1 = this.randomCreature();
    var c2 = this.randomCreature();
    var hybrid = Creature.hybridize(c1, c2);
    if (hybrid) this.recruitableCreatures.push(hybrid);
  }
};

Settlement.prototype.addRecruitableCreatures = function () {
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
          let creatures = Creature.generate(etype, ptype, pop - 9);
          helpers.pushAll(self.recruitableCreatures, creatures);
        }
      }
    }
  }

  this.interbreed(); // possibly add hybrids to recruitableCreatures
};*/
