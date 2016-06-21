var Helpers = require('../util/helpers');

var defaultStats = {
  level: 1,

  strength: 1,
  constitution: 1,
  dexterity: 1,
  intelligence: 1,


};

function Creature (physType, elemType, stats, moves) {
  this.physType = physType;
  this.elemType = elemType;
  this.moves = moves;

  var stats = Helpers.objectUnion(defaultStats, stats);
  Helpers.objectMerge(this, stats);

  this._calculateHP();
}

Creature.prototype._calculateHP = function () {
  this.maxHP = (this.constitution + 1) * this.level + 5;
  this.currentHP = this.maxHP;
};

module.exports = Creature;
