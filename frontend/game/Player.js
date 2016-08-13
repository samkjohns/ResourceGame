function Player() {
}

Player.Neutral = function () {
  Player._neutralPlayer = Player._neutralPlayer || new Player();
  return Player._neutralPlayer;
};

module.exports = Player;
