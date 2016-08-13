var helpers = require('../util/helpers.js'),
    moves = require('../constants/moves.js');

function Move(name) {
  if (!moves[name]) throw `Could not find a move named ${name}`;
  this.name = name;
  const move = moves[name];
  helpers.objectMerge(this, move);
}

Move.filter = function (weeder) {
  const allMoves = Object.keys(moves);
  return allMoves
    .map(function (name) {
      return new Move(name);
    })
    .filter(function (move) {
      if (!weeder) return true;
      return weeder(move);
    });
};

Move.prototype.rollDamage = function () {
  return helpers.randInRange(this.minDmg, this.maxDmg + 1);
};

window.Move = Move;
module.exports = Move;
