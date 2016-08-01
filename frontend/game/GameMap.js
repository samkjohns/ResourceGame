var testGameMap = require('./resources/testmap');
var breadthFirstPath = require('../util/PathFinder.js');
var HexUtil = require('../util/HexUtil.js');
var debug_log = require('../util/helpers.js').debug_log;

function GameMap () {
  this.hexGameMap = testGameMap;
  this.creatureSelection = null;
  this.upper = 0;
  this.left = 0;
  this.lower = GameMap.DISPLAY_SIZE_Y;
  this.right = GameMap.DISPLAY_SIZE_X;
  console.log(`${this.hexGameMap.rows}, ${this.hexGameMap.cols}`);
}

GameMap.DISPLAY_SIZE_X = 29;
GameMap.DISPLAY_SIZE_Y = 14;

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

GameMap.isObstacle = function (tile) {
  var obstacles = ['creature', 'settlement', 'visitable'];

  for (var i = 0; i < obstacles.length; i++) {
    if(tile[obstacles[i]]) {
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

GameMap.prototype.handleClick = function (evnt) {
  var selection = this.hexGameMap.clickedHex(
    evnt,                 // the click event
    GameMap.EDGE_LENGTH,  // hex sizes
    10, 10,               // pixel offsets
    this.upper, this.left // row and column offsets
  );
  var hexVal = selection.hex;
  if (!hexVal) { return false; }

  if (this.creatureSelection) {

    // if the click is on a selected creature, deselect
    if (
      selection.row === this.creatureSelection.hexCoords[0] &&
      selection.col === this.creatureSelection.hexCoords[1]
    ) {
      this.creatureSelection = null;
      this.resetPath();
      return true;

    // else set a path to the clicked destination
    } else {
      var path = breadthFirstPath(
        this.hexGameMap,
        this.creatureSelection.hexCoords,
        [selection.row, selection.col],
        GameMap.isObstacle
      );

      this.setSelectedPathTo(path);
      return path && path.length > 0;
    }

  } else if (hexVal.creature) {
    this.creatureSelection = {
      creature: hexVal.creature,
      hexCoords: [selection.row, selection.col]
    }

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
  var creature = this.creatureSelection.creature;

  var fromCoords = this.creatureSelection.hexCoords;
  console.log(fromCoords);
  var fromHex = this.hexGameMap.valueAt(fromCoords);

  var toCoords = this.path[pathIdx];
  console.log(toCoords);
  var toHex = this.hexGameMap.valueAt(toCoords);
  // console.log(`from: ${fromCoords[0]}, ${fromCoords[1]}`);
  // console.log(`to: ${toCoords[0]}, ${toCoords[1]}`);

  window.setTimeout(
    function () {
      toHex.creature = fromHex.creature;
      fromHex.creature = null;
      self.creatureSelection = {
        creature: toHex.creature,
        hexCoords: toCoords
      };

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
    300
  );
};

GameMap.prototype.move = function (rerender) {
  if (this.path && this.path.length > 0) {
    console.log(`Path:`);
    console.log(this.path[0]);
    console.log(this.path[this.path.length - 1]);
    console.log('...');
    this.animating = true;
    this.animateAlong(this.path.length - 2, rerender, function () {
      this.animating = false;
    }.bind(this));
    return true;

  } return false;
};

GameMap.prototype.getFillType = function (hex, type) {
  return hex.inPath ? "rgba(255, 0, 0, .5)" : GameMap.colors[hex.type];
  // if (hex.inPath) return "rgba(255, 0, 0, .5)";
};

GameMap.prototype.renderObjects = function (ctx, hex, rowIdx, colIdx) {
  if (!hex.discovered) return;

  var nwX, nwY;
  nwX = ((colIdx - this.left) * (GameMap.EDGE_LENGTH + GameMap.HALF_EDGE)) + 10;
  nwY = ((rowIdx - this.upper) * GameMap.SIDE_THREE * 2) + 10
  if (this.left % 2 !== colIdx % 2) nwY += GameMap.EDGE_LENGTH;

  var upperLeft = [nwX + GameMap.HALF_EDGE, nwY];

  hex.object &&
  ctx.drawImage(hex.object.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.visitable &&
  ctx.drawImage(hex.visitable.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.creature &&
  ctx.drawImage(hex.creature.image, upperLeft[0], upperLeft[1], 25, 25);
};

GameMap.prototype.render = function (ctx) {
  window.clearCanvas();

  var drawnLines = {};
  var drawnHexes = {};
  var self = this;

  var vertices;
  var currentWest = [10, 10 + GameMap.SIDE_THREE];

  self.hexGameMap.forEach(
    function (hex, rowIdx, colIdx) {
      // first draw tiles
      vertices = HexUtil.drawHex(
        ctx, currentWest, hex, GameMap.EDGE_LENGTH,
        rowIdx, colIdx, self.hexGameMap.rows, self.hexGameMap.cols,
        drawnLines, drawnHexes,
        function (ctx, hex, row, col, maxRow, maxCol) {

          if (hex.discovered) {
            if (hex.inPath && !self.animating) {
              ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
              ctx.strokeStyle = ctx.fillStyle;

            } else {
              var opacity = (row / maxRow);
              var blue = Math.floor(255 * (col / maxCol));
              var color = `rgba(114, 220, ${blue}, ${opacity})`;
              var stroke = `rgba(114, 220, ${blue}, 1)`;
              ctx.fillStyle = color;
              ctx.strokeStyle = stroke;
            }

          } else {
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'black';
          }
        }
      );

      // then draw objects
      self.renderObjects(ctx, hex, rowIdx, colIdx);

      currentWest = HexUtil.nextWest(
        currentWest, rowIdx, colIdx,
        self.upper, self.right,
        10, 10, GameMap.SIDE_THREE, vertices
      );
    },

    {
      upperLeft: [self.upper, self.left],
      lowerRight: [self.lower, self.right]
    }
  );
};

// window.findPath = require('../util/helpers').findPath;
module.exports = GameMap;
