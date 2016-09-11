var Player = require('./Player');

HumanPlayer.extends(Player);
function HumanPlayer(name, color) {
  Player.call(this, color);
  this.name = name;
}

module.exports = HumanPlayer;
