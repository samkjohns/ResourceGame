var Settlement = require('./Settlement');
var Creature = require('./Creature');

function Civilian(species, ctype) {
  this.species = species;
  this.ctype = ctype;
  this.image = ctype._getImage();
}

Civilian.starter = function (tileType) {
  var pseudoLoc = {
    grid: null,
    tile: { type: tileType },
    point: []
  };
  var tempSettlement = new Settlement({}, pseudoLoc, 10, null);
  var ctype = tempSettlement.generateRandomSeed();
  return new Civilian(ctype.randomSpecies(), ctype);
};

module.exports = Civilian;
