var Helpers = require('../util/helpers');

var defaultStats = {
  level: 1,

  strength: 1,
  constitution: 1,
  dexterity: 1,
  intelligence: 1,
  speed: 5

};

function Creature (physType, elemType, stats, moves, image) {
  moves = moves || {};
  stats = stats || {};

  this.physType = physType;
  this.elemType = elemType;
  this.moves = moves;

  var stats = Helpers.objectUnion(defaultStats, stats);
  Helpers.objectMerge(this, stats);

  this._calculateHP();
  this.image = image;
}

Creature.prototype._calculateHP = function () {
  this.maxHP = (this.constitution + 1) * this.level + 5;
  this.currentHP = this.maxHP;
};

Creature.prototype.render = function (context, point) {
  context.drawImage(this.image, point[0], point[1], 40, 40);
};

Creature.prototype.attack = function (move, otherCreature) {
  otherCreature.currentHP -= move.damage + this.strength;
};

window.Creature = Creature;
module.exports = Creature;
