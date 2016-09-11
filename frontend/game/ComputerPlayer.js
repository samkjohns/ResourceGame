var Player = require('./Player');

ComputerPlayer.extends(Player);
function ComputerPlayer(color) {
  Player.call(this, color);
}

module.exports = ComputerPlayer;
