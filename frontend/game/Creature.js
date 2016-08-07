var helpers = require('../util/helpers');

var defaultStats = {
  level: 1,
  experience: 0,

  strength: 10,
  constitution: 10,
  dexterity: 10,
  intelligence: 10,
  speed: 10
};

const STATS = ['strength', 'constitution', 'dexterity', 'intelligence', 'speed'];
const ATTS = ['level', 'experience'];

function Creature (physType, elemType, baseStats, moves, image) {
  var self = this;
  moves = moves || {};
  baseStats = baseStats || {};

  this.physType = physType;
  this.elemType = elemType;
  this.moves = moves;
  this.base = {};

  baseStats = helpers.objectUnion(defaultStats, baseStats);
  STATS.forEach(function (stat) { self.base[stat] = baseStats[stat]; });
  // ATTS.forEach(function (att) { self[att] = baseStats[att]; });
  this.level = baseStats.level;
  this.experience = baseStats.experience ?
    baseStats.experience : levelThreshhold(this.level - 1);

  this._calculateStats();
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

  STATS.forEach(function (stat) {
    stats[stat] = this[stat];
  }.bind(this));

  return stats;
};

// window.Creature = Creature;
// module.exports = Creature;

var c = new Creature('beast', 'fire', { strength: 12 });
console.log(`level ${c.level}, ${c.experience} XP`);
console.log(c.stats());
c.addExperience(100);
console.log(`level ${c.level}, ${c.experience} XP`);
console.log(c.stats());
c.addExperience(300);
console.log(`level ${c.level}, ${c.experience} XP`);
console.log(c.stats());
