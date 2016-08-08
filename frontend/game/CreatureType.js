var helpers = require('../util/helpers.js');
var types = require('../constants/types.js');

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
    if (this.typePercent(etype) > .3 && otherType.typePercent(etype) > .3)
      return true;
  }

  return false;
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
  console.log(types.statBoosts);
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

// var ct = new CreatureType({
//   water: .4, earth: .4, plant: .2
// }, 'beast');
//
// console.log(ct);
//
// console.log(`boost for strength: ${ct.boostFor('strength')}`);
// console.log(`boost for constitution: ${ct.boostFor('constitution')}`);
// console.log(`boost for dexterity: ${ct.boostFor('dexterity')}`);

module.exports = CreatureType;
