var helpers = require('../util/helpers');

HumanPlayer.extends(Player);
ComputerPlayer.extends(Player);

function Player(color) {
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
  var tileType = map.grid.valueAt(start).type;
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

function HumanPlayer(name, color) {
  this.superClass.call(this, color);
  this.name = name;
}

function ComputerPlayer(color) {
  this.superClass.call(this, color);
}

module.exports = Player;
