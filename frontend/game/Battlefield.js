var HexGrid = require('../util/HexGrid');

function Battlefield (attackingParty, defendingParty) {
  this.attackingParty = attackingParty;
  this.defendingParty = defendingParty;
  this._calcOrder();

  this.grid = new HexGrid(15, 25);
}

Battlefield.EDGE_LENGTH = 30;
Battlefield.HALF_EDGE = 15;
Battlefield.SIDE_THREE = Math.sqrt(3) * Battlefield.HALF_EDGE;

Battlefield.prototype._calcOrder = function () {
  if (!this.attackingParty || !this.defendingParty) {
    return [];
  }

  this.order = [];
  var attackers = this.attackingParty.slice();
  var defenders = this.defendingParty.slice();
  var turn = Math.random() > .5 ? "attackers" : "defenders";

  while (attackers.length > 0 && defenders.length > 0) {
    var array = turn === "attackers" ? attackers : defenders;
    var idx = Math.floor(array.length * Math.random());

    this.order.push(array[idx]);
    array.splice(idx, 1);

    turn = turn === "attackers" ? "defenders" : "attackers";
  }

  this.order = this.order.concat(attackers, defenders);
};


Battlefield.prototype.render = function (ctx) {
  var drawnLines = {};
  var drawnHexes = {};
  var sideThree = Math.sqrt(3) * 25;

  function drawHex (west) {
    var startX = west[0];
    var startY = west[1];
    var vertices = {
      W: west, // [Battlefield.SIDE_THREE, 0];

      NW: [
        startX + Battlefield.HALF_EDGE,
        startY - Battlefield.SIDE_THREE
      ],

      NE: [
        startX + (Battlefield.HALF_EDGE + Battlefield.EDGE_LENGTH),
        startY - Battlefield.SIDE_THREE
      ],

      E: [
        startX + (2 * Battlefield.EDGE_LENGTH),
        startY
      ],

      SW: [
        startX + Battlefield.HALF_EDGE,
        startY + Battlefield.SIDE_THREE
      ],

      SE: [
        startX + Battlefield.HALF_EDGE + Battlefield.EDGE_LENGTH,
        startY + Battlefield.SIDE_THREE
      ],
    };

    var hexJSON = JSON.stringify(vertices);
    if (!drawnHexes[hexJSON]) {

      function moveTo(ctx, point) { ctx.moveTo(point[0], point[1]); }
      function lineTo(ctx, from, to) {
        var lineJSON = JSON.stringify({
          from: from,
          to: to
        });

        if (!drawnLines[lineJSON]) {
          ctx.lineTo(to.point[0], to.point[1]);
          drawnLines[lineJSON] = true;
        }
      }

      ctx.beginPath();

      moveTo(ctx, west);
      lineTo(
        ctx,
        {loc: 'W', point: west},
        {loc: 'NW', point: vertices.NW}
      );
      lineTo(
        ctx,
        {loc: 'NW', point: vertices.NW},
        {loc: 'NE', point: vertices.NE}
      );
      lineTo(
        ctx,
        {loc: 'NE', point: vertices.NE},
        {loc: 'E', point: vertices.E}
      );
      lineTo(
        ctx,
        {loc: 'E', point: vertices.E},
        {loc: 'SE', point: vertices.SE}
      );
      lineTo(
        ctx,
        {loc: 'SE', point: vertices.SE},
        {loc: 'SW', point: vertices.SW}
      );
      lineTo(
        ctx,
        {loc: 'SW', point: vertices.SW},
        {loc: 'W', point: vertices.W}
      );

      ctx.strokeStyle = "rgba(0, 0, 0, .4)";
      ctx.stroke();
      ctx.fillStyle = "rgba(114, 220, 90, 0.65)";
      ctx.fill();

      drawnHexes[hexJSON] = true;
    }


    return vertices;
  }

  var vertices;
  var currentWest = [10, 10 + Battlefield.SIDE_THREE];
  console.log("drawing?");
  this.grid.forEach(function (hex, rowIdx, colIdx) {
    console.log("drawing " + currentWest);
    vertices = drawHex(currentWest);

    if (colIdx === this.grid.cols - 1) {
      currentWest = [
        10,
        10 + Battlefield.SIDE_THREE + (rowIdx * Battlefield.SIDE_THREE * 2)
      ];

    } else if (colIdx % 2 === 0) {
      currentWest = vertices.SE;

    } else {
      currentWest = vertices.NE;
    }

  }.bind(this));
};

module.exports = Battlefield;
