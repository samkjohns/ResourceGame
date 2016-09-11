var helpers = require('../util/helpers');
var Civilian = require('./Civilian');

var id = 0;

function Player(color) {
  this.id = ++id;
  this.color = color;
  this.civilians = [];
  this.creatures = [];
  this.settlements = [];
}

// probably not going to use this
Player.Neutral = function () {
  Player._neutralPlayer = Player._neutralPlayer || new Player();
  return Player._neutralPlayer;
};

Player.prototype.setStart = function (map, start) {
  this.start = start;
  var tileType = map.hexGameMap.valueAt(start).type;
  var startCivilian = Civilian.starter(tileType);
  map.placeCreatureAt(start[0], start[1], startCivilian);
  this.civilians.push(Civilian.starter(tileType));
};

Player.prototype.territory = function () {
  var territory = [];

  this.settlements.forEach(function (settlement) {
    helpers.pushAll(territory, settlement.territory);
  });

  return territory;
};

module.exports = Player;
