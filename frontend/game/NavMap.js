var Dimensions = require('../constants/dimensions.js'),
    GameMap = require('./GameMap.js'),
    HexUtil = require('../util/HexUtil.js');

NavMap.DIM_UPPER = 10;
NavMap.DIM_LOWER = 160;
NavMap.DIM_LEFT = Dimensions.DIM_X - 170;
NavMap.DIM_RIGHT = Dimensions.DIM_X - 20;

NavMap.DIM_X = NavMap.DIM_RIGHT - NavMap.DIM_LEFT;
NavMap.DIM_Y = NavMap.DIM_LOWER - NavMap.DIM_UPPER;

function NavMap(hexMap) {
  this.hexGameMap = hexMap;

  this.SIDE_THREE = (NavMap.DIM_Y - 1) / (hexMap.rows * 2);
  this.HALF_EDGE = this.SIDE_THREE / Math.sqrt(3);
  this.EDGE_LENGTH = this.HALF_EDGE * 2;
}

NavMap.prototype.handleClick = function (evnt) {

};

NavMap.clear = function (ctx) {
  ctx.clearRect(
    NavMap.DIM_LEFT, NavMap.DIM_UPPER,
    NavMap.DIM_X, NavMap.DIM_Y
  );
};

NavMap.prototype.render = function (ctx) {
  NavMap.clear(ctx);

  var drawnLines = {};
  var drawnHexes = {};
  var self = this;
  var vertices;
  var currentWest = [NavMap.DIM_LEFT, NavMap.DIM_UPPER + this.SIDE_THREE];

  self.hexGameMap.forEach(
    function (hex, rowIdx, colIdx) {
      vertices = HexUtil.drawHex(
        ctx, currentWest, hex, self.EDGE_LENGTH,
        rowIdx, colIdx, self.hexGameMap.rows, self.hexGameMap.cols,
        drawnLines, drawnHexes,
        function (ctx, hex, row, col, maxRow, maxCol) {
          if (hex.inPath) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.strokeStyle = ctx.fillStyle;

          } else {
            var opacity = (row / maxRow);
            var blue = Math.floor(255 * (col / maxCol));
            var color = `rgba(114, 220, ${blue}, ${opacity})`;
            var stroke = `rgba(114, 220, ${blue}, 0)`;
            ctx.fillStyle = color;
            ctx.strokeStyle = stroke;
          }
        }
      );

      if (colIdx === self.hexGameMap.cols - 1) {
        currentWest = [
          NavMap.DIM_LEFT,
          NavMap.DIM_UPPER + self.SIDE_THREE + ((rowIdx + 1) * self.SIDE_THREE * 2)
        ];

      } else if (colIdx % 2 === 0) {
        currentWest = vertices.SE;

      } else {
        currentWest = vertices.NE;
      }

    }
  );

  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(0, 0, 0, .8)`;
  ctx.strokeRect(
    NavMap.DIM_LEFT, NavMap.DIM_UPPER,
    NavMap.DIM_X, NavMap.DIM_Y
  );
};


module.exports = NavMap;
