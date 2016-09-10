// var testGameMap = require('./resources/testmap');
var DetailActions = require('../actions/DetailActions.js');
var breadthFirstPath = require('../util/PathFinder.js');
var HexUtil = require('../util/HexUtil.js');
var Types = require('../constants/types.js');
var helpers = require('../util/helpers.js');
var debug_log = helpers.debug_log;

function GameMap (grid) {
  this.hexGameMap = grid;
  this.selection = null;
  this.upper = 0;
  this.left = 0;
  this.lower = GameMap.DISPLAY_SIZE_Y;
  this.right = GameMap.DISPLAY_SIZE_X;
  // console.log(`${this.hexGameMap.rows}, ${this.hexGameMap.cols}`);
}

GameMap.DISPLAY_SIZE_X = 30;
GameMap.DISPLAY_SIZE_Y = 15;

GameMap.EDGE_LENGTH = 20;
GameMap.HALF_EDGE = 10;
GameMap.SIDE_THREE = Math.sqrt(3) * GameMap.HALF_EDGE;

GameMap.colors = {
  grass: "rgba(114, 220, 90, 0.65)"
};

GameMap.prototype.placeObjectAt = function (row, col, object) {
  this.hexGameMap.valueAt(row, col).object = object;
};

GameMap.prototype.placeCreatureAt = function (row, col, creature) {
  this.hexGameMap.valueAt(row, col).creature = creature;
};

GameMap.prototype.placeVisitableObjectAt = function (row, col, visitable) {
  this.hexGameMap.valueAt(row, col).visitable = visitable;
};

GameMap.prototype.placeSettlementAt = function (row, col, settlement) {
  this.hexGameMap.valueAt(row, col).settlement = settlement;
};

GameMap.prototype.placeAt = function (row, col, type, thing) {
  var tile = this.hexGameMap.valueAt(row, col);
  tile[type] = thing;
};

GameMap.isObstacle = function (tile) {
  if (!tile.discovered) return true;

  var obstacles = ['creature', 'settlement', 'visitable'];
  var types = ['water', 'mountain'];

  for (var i = 0; i < obstacles.length; i++) {
    if(tile[obstacles[i]] || types.indexOf(tile.type) > -1) {
      return true;
    }
  }

  return false;
};

GameMap.isVisitable = function (tile) {
  var visitables = ['visitable', 'settlement', 'creature'];

  for (var i = 0; i < obstacles.length; i++) {
    if(tile[obstacles[i]]) {
      return true;
    }
  }

  return false;
};

GameMap.prototype.setSelectedPathTo = function (path) {
  this.resetPath();
  if (path) {
    this.path = path;
    path.forEach(function (coords) {
      this.hexGameMap.valueAt(coords).inPath = true;
    }.bind(this));
  } else {
    this.path = [];
  }
};

GameMap.prototype.resetPath = function () {
  this.path && this.path.forEach(function (coords) {
    this.hexGameMap.valueAt(coords).inPath = false;
  }.bind(this));
  this.path = [];
};

GameMap.prototype.handleHover = function (evnt) {
  var selection = this.hexGameMap.clickedHex(
    evnt,                 // the click event
    GameMap.EDGE_LENGTH,  // hex sizes
    10, 10,               // pixel offsets
    this.upper, this.left // row and column offsets
  );

  if (!this.hoverSelection ||
      selection.row !== this.hoverSelection.row ||
      selection.col !== this.hoverSelection.col) {
    this.hoverSelection = selection;
    console.log(`${selection.row}, ${selection.col}`);
  }
};

GameMap.prototype.shift = function (dir, n) {
  var bound1, bound2;
  var next1, next2;
  var limit;

  if (dir == 'x') {
    bound1 = 'left';
    bound2 = 'right';
    limit = this.hexGameMap.cols;

  } else {
    bound1 = 'upper';
    bound2 = 'lower';
    limit = this.hexGameMap.rows;
  }

  next1 = this[bound1] + n;
  next2 = this[bound2] + n;

  if (helpers.between(next1, 0, limit) && helpers.between(next2, 0, limit)) {
    this[bound1] = next1;
    this[bound2] = next2;
  }

};

GameMap.prototype.handleKey = function (dir, rerender) {
  var n;
  if (dir === "Right" || dir === "Left") {
    n = dir === "Right" ? 1 : -1;
    this.shift('x', n);

  } else {
    n = dir === "Up" ? -1 : 1;
    this.shift('y', n);
  }

  rerender();
};

GameMap.prototype.handleClick = function (evnt) {
  var selection = this.hexGameMap.clickedHex(
    evnt,                 // the click event
    GameMap.EDGE_LENGTH,  // hex sizes
    10, 10,               // pixel offsets
    this.upper, this.left // row and column offsets
  );
  var hexVal = selection.hex;
  if (!hexVal || !hexVal.discovered) { return false; }

  if (this.selection && this.selection.hex.creature) {
    var selectionClicked = (
      (selection.row === this.selection.row) &&
      (selection.col === this.selection.col)
    );

    var flag = true;

    if (!selectionClicked) {
      const start = [this.selection.row, this.selection.col];
      const goal = [selection.row, selection.col];
      var path = breadthFirstPath(
        this.hexGameMap, start, goal, GameMap.isObstacle
      );
      // console.log(path);
      this.setSelectedPathTo(path);
      flag = path && path.length > 0;
    }

    this.selection = selection;
    DetailActions.updateDetail(this.selection);

    return flag;

  } else {
    this.selection = selection;
    DetailActions.updateDetail(this.selection);

    return true;
  }
};

GameMap.prototype.setNewBounds = function (coords) {
  var n_upper = coords[0] - Math.floor(GameMap.DISPLAY_SIZE_Y / 2);
  var n_lower = n_upper + GameMap.DISPLAY_SIZE_Y;
  var n_left = coords[1] - Math.floor(GameMap.DISPLAY_SIZE_X / 2);
  var n_right = n_left + GameMap.DISPLAY_SIZE_X;

  var rows = this.hexGameMap.rows;
  var cols = this.hexGameMap.cols;

  if (n_upper < 0) {
    this.upper = 0;
    this.lower = GameMap.DISPLAY_SIZE_Y;

  } else {
    this.upper = n_upper;
    this.lower = n_lower > rows ? rows : n_lower;
  }

  if (n_left < 0) {
    this.left = 0;
    this.right = GameMap.DISPLAY_SIZE_X;

  } else {
    this.left = n_left;
    this.right = n_right > cols ? cols : n_right;
  }
};

GameMap.prototype.discover = function (row, col) {
  this.hexGameMap.valueAt(row, col).discovered = true;
  var neighbors = this.hexGameMap.neighborsOf(row, col);

  Object.keys(neighbors).forEach(function (dir) {
    var neighbor = neighbors[dir];
    neighbor.discovered = true;
  });
};

GameMap.prototype.animateAlong = function (pathIdx, rerender, success) {
  var self = this;
  var creature = this.selection.creature;

  var fromCoords = [this.selection.row, this.selection.col];
  var fromHex = this.hexGameMap.valueAt(fromCoords);

  var toCoords = this.path[pathIdx];
  var toHex = this.hexGameMap.valueAt(toCoords);

  window.setTimeout(
    function () {
      toHex.creature = fromHex.creature;
      fromHex.creature = null;
      self.selection.row = toCoords[0];
      self.selection.col = toCoords[1];

      self.discover(toCoords[0], toCoords[1]);

      if (pathIdx === 0) {
        self.resetPath();
        rerender();
        success && success(self, pathIdx, rerender);

      } else  {
        rerender();
        self.animateAlong(pathIdx - 1, rerender, success);
      }
    },
    50
  );
};

GameMap.prototype.move = function (rerender) {
  if (this.path && this.path.length > 0) {
    this.animating = true;
    this.animateAlong(this.path.length - 2, rerender, function () {
      this.animating = false;
    }.bind(this));
    return true;

  } return false;
};

GameMap.prototype.renderObjects = function (ctx, hex, rowIdx, colIdx) {
  // if (!hex.discovered) return;
  if (!hex) return;

  var nwX, nwY;
  nwX = ((colIdx - this.left) * (GameMap.EDGE_LENGTH + GameMap.HALF_EDGE)) + 10;
  nwY = ((rowIdx - this.upper) * GameMap.SIDE_THREE * 2) + 10;
  if (colIdx % 2 === 1) nwY += GameMap.EDGE_LENGTH;

  var upperLeft = [nwX + GameMap.HALF_EDGE, nwY];

  hex.settlement &&
  ctx.drawImage(hex.settlement.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.object &&
  ctx.drawImage(hex.object.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.visitable &&
  ctx.drawImage(hex.visitable.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.creature &&
  ctx.drawImage(hex.creature.image, upperLeft[0], upperLeft[1], 25, 25);
};

GameMap.prototype.render = function (ctx) {
  window.clearCanvas();

  // console.log(this.path);

  var drawnLines = {};
  var drawnHexes = {};
  var self = this;

  var vertices;
  // var currentWest = [10, 10 + GameMap.SIDE_THREE];

  var startX = 10 - GameMap.HALF_EDGE - GameMap.EDGE_LENGTH;
  var startY = 20 - GameMap.SIDE_THREE - ((self.left % 2) * GameMap.SIDE_THREE);
  // if (self.upper % 2 === 1 && self.left % 2 === 1) {
  //   startY -= GameMap.SIDE_THREE;
  // }

  var currentWest = [startX, startY];

  self.hexGameMap.forEach(
    function (hex, rowIdx, colIdx) {
      // first draw tiles
      vertices = HexUtil.drawHex(
        ctx, currentWest, hex, GameMap.EDGE_LENGTH,
        rowIdx, colIdx, self.hexGameMap.rows, self.hexGameMap.cols,
        drawnLines, drawnHexes,
        helpers.getFillType.bind(null, self.animating)    // with shadows
        // helpers.getShowAll.bind(null, self.animating)  // show all tiles (debugging)
        // helpers.getGradient.bind(null, self.animating) // gradient       (debugging)
      );

      // then draw objects
      self.renderObjects(ctx, hex, rowIdx, colIdx);

      currentWest = HexUtil.nextWest(
        currentWest, rowIdx, colIdx,
        self.upper - 1, self.right,
        startX, startY, GameMap.SIDE_THREE, vertices
      );
    },

    {
      upperLeft: [self.upper - 1, self.left - 1],
      lowerRight: [self.lower, self.right]
    }
  );
};

// window.findPath = require('../util/helpers').findPath;
module.exports = GameMap;
