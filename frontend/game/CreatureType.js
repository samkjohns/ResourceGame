var helpers = require('../util/helpers.js');
var types = require('../constants/types.js');
var creatures = require('../constants/creatures.js');
var ATTRIBUTES = require('../constants/attributes.js');

function CreatureType(etypes, ptype) {
  this.physical = ptype;
  this.elemental = etypes; // types --> percents (0-1)
}

types.creatures.forEach(function (etype) {
  let checkerName = `is${helpers.capitalize(etype)}`;
  CreatureType.prototype[checkerName] = function () {
    return this.elemental[etype] && this.elemental[etype] > 0;
  };

  let percentName = `${etype}Percent`;
  CreatureType.prototype[percentName] = function () {
    return this.elemental[etype] || 0;
  };
});

types.physical.forEach(function (ptype) {
  let checkerName = `is${helpers.capitalize(ptype)}`;
  CreatureType.prototype[checkerName] = function () {
    return this.physical === ptype;
  };
});

CreatureType.prototype.typePercent = function (etype) {
  return this.elemental[etype] || 0;
};

CreatureType.prototype.isElementalType = function (etype) {
  return this.elemental[etype] && this.elemental[etype] > 0;
};

CreatureType.prototype.isPhysicalType = function (ptype) {
  return this.physical === ptype;
};

CreatureType.prototype.canBreedWith = function (otherType) {
  if (this.physical === otherType.physical) return true;

  for (let i = 0; i < this.elemental.length; i++) {
    let etype = this.elemental[i];
    if (this.typePercent(etype) > 0.3 && otherType.typePercent(etype) > 0.3)
      return true;
  }

  return false;
};

CreatureType.prototype.canBeSpecies = function (speciesName) {
  const self = this;
  const stypes = creatures[speciesName].types;

  const physMatch = stypes.physical.some(function (ptype) {
    return self.isPhysicalType(ptype);
  });

  if (!physMatch) return false;
  if (!stypes.elemental) return true;

  const elTypes = Object.keys(stypes.elemental);
  const elMatch = elTypes.every(function (etype) {
    return self.typePercent(etype) >= stypes.elemental[etype];
  });

  return physMatch && elMatch;
};

CreatureType.prototype.randomSpecies = function () {
  const allSpecies = Object.keys(creatures);
  const validSpecies = allSpecies.filter(this.canBeSpecies.bind(this));
  return helpers.randomChoice(validSpecies);
};

CreatureType.prototype.randomStats = function () {
  var ptype = this.physical;
  var etypes = this.elemental;
  var stats = {level: 1, experience: 0};

  ATTRIBUTES.stats.forEach(function (stat) {
    let sVal = helpers.randInRange(6, 14) + this.boostFor(stat);
    stats[stat] = sVal;
  }.bind(this));

  return stats;
};

/*
      1      2     avg
fire  .3    .2    .25
water .4    .2    .3
plant .3    .2    .25
earth 0     .4    .2

*/
CreatureType.hybridize = function (ct1, ct2) {
  if (!ct1.canBreedWith(ct2)) return null;

  var physTypes = [ct1.physical, ct2.physical]
  var randIdx = helpers.randInRange(0, 2);
  var ptype = physTypes[randIdx];

  // average the etypes of each CreatureType
  var etypes = {};
  Object.keys(ct1.elemental).forEach(function (etype) {
    etypes[etype] = ct1.elemental[etype];
  });

  Object.keys(ct2.elemental).forEach(function (etype) {
    etypes[etype] = etypes[etype] || 0;
    etypes[etype] += ct2.elemental[etype];
  });

  Object.keys(etypes).forEach(function (etype) {
    etypes[etype] /= 2;
  });

  return new CreatureType(etypes, ptype);
};

CreatureType.prototype.boostFor = function (stat) {
  // if (types.physical.indexOf(stat) >= 0) {
  //   return types.statBoosts[this.physical][stat];
  // console.log(this.physical);
  var fromPhysical = types.statBoosts[this.physical][stat] || 0;

  var fromElemental = Object.keys(this.elemental).reduce(
    function (acc, etype) {
      var rawBoost = types.statBoosts[etype][stat] || 0;
      var adjustedBoost = rawBoost * (.3 + this.elemental[etype]);
      return acc + adjustedBoost;
    }.bind(this), 0
  );

  return Math.floor(fromPhysical + fromElemental);
};

window.CreatureType = CreatureType;
module.exports = CreatureType;
