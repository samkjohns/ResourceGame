var helpers = require('../util/helpers.js');
var types = require('../constants/types.js');
var ATTRIBUTES = require('../constants/attributes.js');
var Move = require('./Move.js');
var CreatureType = require('./CreatureType.js');

var defaultStats = {
  level: 1,
  experience: 0,

  strength: 10,
  constitution: 10,
  dexterity: 10,
  intelligence: 10,
  speed: 10
};

function Creature(species, ctype, baseStats, moves) {
  var self = this;
  moves = moves || {};
  baseStats = baseStats || {};

  // this.physType = physType;
  // this.elemType = elemType;
  this.species = species;
  this.type = ctype;
  this.moves = moves;
  this.base = {};

  baseStats = helpers.objectUnion(defaultStats, baseStats);
  ATTRIBUTES.stats.forEach(function (stat) { self.base[stat] = baseStats[stat]; });
  this.level = baseStats.level;
  this.experience = baseStats.experience ?
    baseStats.experience : levelThreshhold(this.level - 1);

  this._getImage();
  this._calculateStats();
  this._calculateHP();
}

Creature.generateCreature = function (ctype) {
  var species = ctype.randomSpecies();
  var stats = ctype.randomStats();

  var creature = new Creature(species, ctype, stats);
  var knowableMoves = creature.knowableMoves();
  // console.log(knowableMoves);
  creature.moves = [helpers.randomChoice(knowableMoves)];

  return creature;
};

Creature.generate = function (ctype, num) {
  // return an array of generated creatures at level 1
  return [...Array(num).keys()].map(function () {
    return Creature.generateCreature(ctype);
  });
};

Creature.prototype._calculateHP = function () {
  this.maxHP = (this.constitution + 1) * this.level + 5;
  this.currentHP = this.maxHP;
};

Creature.prototype._getImage = function () {
  this.image = this.type._getImage();
};

Creature.prototype.render = function (context, point) {
  context.drawImage(this.image, point[0], point[1], 40, 40);
};

Creature.prototype.attack = function (move, otherCreature) {
  otherCreature.currentHP -= move.damage + this.strength;
};

Creature.prototype.isDead = function () {
  return this.currentHP <= 0;
};

// level is the amount of experience you need to get to the *next* level
// e.g., you need 0 experience to get to level 1 and 100 to get to level 2, so
// if level === 1, this returns 100
function levelThreshhold(level) {
  return Math.pow(level, 2) * 100;
}

Creature.prototype.nextLevelThreshhold = function () {
  return levelThreshhold(this.level);
};

Creature.prototype.statModifier = function (stat) {
  var mod = Math.floor((this.base[stat] - 10) / 2);
  return mod < 0 ? 0 : mod;
};

Creature.prototype._calculateStats = function () {
  var self = this;
  Object.keys(self.base).forEach(function (stat) {
    var baseStat = self.base[stat];
    var mod = self.statModifier(stat);
    var currentStat = baseStat + (self.level - 1) * (1 + mod);
    self[stat] = currentStat;
  });

  // this.experience = levelThreshhold(this.level - 1);
};

Creature.prototype.levelStat = function (stat) {
  var modifier = this.statModifier(stat);
  var increment = 1 + modifier;
  this[stat] += increment;
  return this[stat];
};

Creature.prototype.addExperience = function (xp) {
  this.experience += xp;
  return this.levelUp();
};

Creature.prototype.levelUp = function () {
  var leveled = this.experience >= this.nextLevelThreshhold();
  if (leveled) {
    this.level++;
    this._calculateStats();
  }
  return leveled;
};

Creature.prototype.stats = function () {
  var stats = {};

  ATTRIBUTES.stats.forEach(function (stat) {
    stats[stat] = this[stat];
  }.bind(this));

  return stats;
};

Creature.prototype.canKnowMove = function (move) {
  if (typeof(move) === 'string') move = new Move(move);

  return (
    (move.minLevel <= this.level) &&
    (move.types.indexOf(this.type.physical) >= 0)
  );
};

Creature.prototype.knowableMoves = function () {
  return Move.filter(function (move) {
    return this.canKnowMove(move);
  }.bind(this));
};

// window.Creature = Creature;
module.exports = Creature;
