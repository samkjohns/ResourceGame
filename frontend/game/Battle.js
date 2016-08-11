var Battlefield = require('./Battlefield.js');

function Battle(location, attackers, defenders) {
  this.location = location;
  this.attackers = attackers;
  this.defenders = defenders;
  this.field = new Battlefield(attackers, defenders, location.tile.type);

  this.round = 1;
  this._calcOrder();
}

Battle.prototype._calcOrder = function () {
  if (!this.attackers || !this.defenders) {
    throw 'Battle was created without attackers or defenders';
  }

  this.order = this.attackers.concat(this.defenders)
    .map(function (crt) {
      return {
        iv: crt.getInitiative(),
        creature: crt
      };
    })
    .sort(function (ivObj1, ivObj2) {
      let iv1 = ivObj1.iv;
      let iv2 = ivObj2.iv;
      if (iv1 < iv2) return 1;
      if (iv1 > iv2) return -1;
      return 0;
    });

  this.turn = 0;
};

Battle.prototype._nextInTurn = function () {
  this.turn++;
  if (this.turn >= this.order.length){
    this.turn = 0;
    this.round++;
  }
};

Battle.prototype._nextTurn = function () {
  this._nextInTurn();
  while (this._currentCreature().isDead())
    this._nextInTurn();
};

Battle.prototype._currentCreature = function () {
  return this.order[this.turn];
};
