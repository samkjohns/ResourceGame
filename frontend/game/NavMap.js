var Dimensions = require('../constants/dimensions.js'),
    GameMap = require('./GameMap.js'),
    helpers = require('../util/helpers.js'),
    HexUtil = require('../util/HexUtil.js');

NavMap.DIM_UPPER = 11;
NavMap.DIM_LOWER = 161;
NavMap.DIM_LEFT = Dimensions.DIM_X - 170;
NavMap.DIM_RIGHT = Dimensions.DIM_X - 20;

NavMap.DIM_X = NavMap.DIM_RIGHT - NavMap.DIM_LEFT;
NavMap.DIM_Y = NavMap.DIM_LOWER - NavMap.DIM_UPPER;

function NavMap(gameMap) {
  this.map = gameMap;
  this.hexGameMap = gameMap.hexGameMap;

  this.SIDE_THREE = (NavMap.DIM_Y - 3) / (this.hexGameMap.rows * 2);
  this.HALF_EDGE = this.SIDE_THREE / Math.sqrt(3);
  this.EDGE_LENGTH = this.HALF_EDGE * 2;
}

NavMap.prototype.inBounds = function (x, y) {
  return helpers.between(y, NavMap.DIM_UPPER, NavMap.DIM_LOWER) &&
         helpers.between(x, NavMap.DIM_LEFT,  NavMap.DIM_RIGHT);
};

NavMap.prototype.handleClick = function (evnt, gameMap) {
  if (this.inBounds(evnt.pageX, evnt.pageY)) {
    var selection = this.hexGameMap.clickedHex(
      evnt, this.EDGE_LENGTH,
      NavMap.DIM_LEFT, NavMap.DIM_UPPER, 0, 0
    );

    gameMap.setNewBounds([selection.row, selection.col])

    return true;
  }

  return false;
};

NavMap.clear = function (ctx) {
  ctx.clearRect(
    NavMap.DIM_LEFT, NavMap.DIM_UPPER,
    NavMap.DIM_X, NavMap.DIM_Y
  );
};

NavMap.prototype.renderBounds = function (ctx) {
  var zeroX = NavMap.DIM_LEFT + this.HALF_EDGE;
  var zeroY = NavMap.DIM_UPPER + this.SIDE_THREE;

  var left = zeroX + (this.EDGE_LENGTH * this.map.left * 1.5);
  var right = zeroX + (this.EDGE_LENGTH * this.map.right * 1.5);
  var upper = zeroY + (this.SIDE_THREE * this.map.upper * 2);
  var lower = zeroY + (this.SIDE_THREE * this.map.lower * 2);
  var xLen = right - left;
  var yLen = lower - upper;

  ctx.strokeStyle = 'black';
  ctx.strokeRect(left, upper, xLen, yLen);
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
        helpers.getShowAll.bind(null, false)
      );

      currentWest = HexUtil.nextWest(
        currentWest, rowIdx, colIdx,
        0, self.hexGameMap.cols,
        NavMap.DIM_LEFT, NavMap.DIM_UPPER,
        self.SIDE_THREE, vertices
      );

    }
  );

  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(0, 0, 0, .8)`;
  ctx.strokeRect(
    NavMap.DIM_LEFT, NavMap.DIM_UPPER,
    NavMap.DIM_X, NavMap.DIM_Y
  );
  this.renderBounds(ctx);
};


module.exports = NavMap;
