var Helpers = require('../util/helpers');

var defaultStats = {
  level: 1,

  strength: 1,
  constitution: 1,
  dexterity: 1,
  intelligence: 1,
  speed: 5,

  experience: 0
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

Creature.prototype.nextLevelThreshhold = function () {
  var nextLevel = this.level + 1;
  return Math.pow(nextLevel, 2) * 100;
};

Creature.prototype.addExperience = function (xp) {
  this.experience += xp;
  return this.levelUp();
};

Creature.prototype.statModifier = function (stat) {
  return Math.floor((this.baseStat() - 10) / 2);
};

Creature.prototype.baseStat = function (stat) {

};

Creature.prototype.levelStat = function (stat) {
  var modifier = this.statModifier(stat);
  var baseStat = this.baseStat(stat);
  var increment = 1 + ((this.level - 1) * modifier);
  this[stat] += increment;
  return this[stat];
};

Creature.prototype.levelUp = function () {
  var leveled = this.experience >= this.nextLevelThreshhold();
  if (leveled) this.level++;
  return leveled;

};

window.Creature = Creature;
module.exports = Creature;
