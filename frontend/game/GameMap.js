var testGameMap = require('./resources/testmap');
var breadthFirstPath = require('../util/PathFinder.js');
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

  // console.log("New bounds!");
  // console.log("Upper: " + this.upper);
  // console.log("Lower: " + this.lower);
  // console.log("Left: " + this.left);
  // console.log("Right: " + this.right);
};

GameMap.prototype.move = function () {
  if (this.path && this.path.length > 0) {
    var creature = this.creatureSelection.creature;
    var fromCoords = this.creatureSelection.hexCoords;
    var toCoords = this.path[0];
    var fromHex = this.hexGameMap.valueAt(fromCoords);
    var toHex = this.hexGameMap.valueAt(toCoords);

    toHex.creature = fromHex.creature;
    fromHex.creature = null;
    this.creatureSelection = {
      creature: toHex.creature,
      hexCoords: toCoords
    };
    this.resetPath();
    this.setNewBounds(toCoords);

    return true;
  } return false;
};

GameMap.prototype.getFillType = function (hex, type) {
  return hex.inPath ? "rgba(255, 0, 0, .5)" : GameMap.colors[hex.type];
  // if (hex.inPath) return "rgba(255, 0, 0, .5)";
};

GameMap.prototype.renderObjects = function (ctx, hex, rowIdx, colIdx) {
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

function moveTo(ctx, point) {
  ctx.moveTo(point[0], point[1]);
}

function lineTo(ctx, drawnLines, from, to) {
  var lineJSON = JSON.stringify({
    from: from,
    to: to
  });

  if (!drawnLines[lineJSON]) {
    ctx.lineTo(to.point[0], to.point[1]);
    drawnLines[lineJSON] = true;
  }
}

function drawHex (
  map,
  ctx, west, hex,
  row, col, maxRow, maxCol,
  drawnLines, drawnHexes
) {
  var startX = west[0];
  var startY = west[1];

  var debug = map.upper === 1 && row < 5 && col === 0;

  var vertices = {
    W: west,

    NW: [
      startX + GameMap.HALF_EDGE,
      startY - GameMap.SIDE_THREE
    ],

    NE: [
      startX + (GameMap.HALF_EDGE + GameMap.EDGE_LENGTH),
      startY - GameMap.SIDE_THREE
    ],

    E: [
      startX + (2 * GameMap.EDGE_LENGTH),
      startY
    ],

    SW: [
      startX + GameMap.HALF_EDGE,
      startY + GameMap.SIDE_THREE
    ],

    SE: [
      startX + GameMap.HALF_EDGE + GameMap.EDGE_LENGTH,
      startY + GameMap.SIDE_THREE
    ],
  };

  var hexJSON = JSON.stringify(vertices);
  if (!drawnHexes[hexJSON]) {
    ctx.beginPath();

    moveTo(ctx, west);
    lineTo(
      ctx, drawnLines,
      {loc: 'W', point: west},
      {loc: 'NW', point: vertices.NW}
    );
    lineTo(
      ctx, drawnLines,
      {loc: 'NW', point: vertices.NW},
      {loc: 'NE', point: vertices.NE}
    );
    lineTo(
      ctx, drawnLines,
      {loc: 'NE', point: vertices.NE},
      {loc: 'E', point: vertices.E}
    );
    lineTo(
      ctx, drawnLines,
      {loc: 'E', point: vertices.E},
      {loc: 'SE', point: vertices.SE}
    );
    lineTo(
      ctx, drawnLines,
      {loc: 'SE', point: vertices.SE},
      {loc: 'SW', point: vertices.SW}
    );
    lineTo(
      ctx, drawnLines,
      {loc: 'SW', point: vertices.SW},
      {loc: 'W', point: vertices.W}
    );

    // ctx.strokeStyle = "rgba(0, 0, 0, .4)";
    // ctx.stroke();

    // establish a gradient for testing
    // if (debug) debugger;
    if (hex.inPath) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.strokeStyle = ctx.fillStyle;

    } else {
      var opacity = (row / maxRow);
      var blue = Math.floor(255 * (col / maxCol));
      var color = `rgba(114, 220, ${blue}, ${opacity})`;
      var stroke = `rgba(114, 220, ${blue}, 1)`
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
    }
    ctx.stroke();
    // ctx.fillStyle = map.getFillType(hex);
    ctx.fill();

    drawnHexes[hexJSON] = true;
  }

  return vertices;
}

GameMap.prototype.render = function (ctx) {
  window.clearCanvas();

  var drawnLines = {};
  var drawnHexes = {};
  var self = this;

  var vertices;
  var currentWest = [10, 10 + GameMap.SIDE_THREE];

  console.log(
  `
row: ${this.upper} -> ${this.lower}
col: ${this.left} -> ${this.right}
  `
  );
  self.hexGameMap.forEach(
    function (hex, rowIdx, colIdx) {
      // first draw tiles
      vertices = drawHex(
        map,
        ctx, currentWest, hex,
        rowIdx, colIdx, self.hexGameMap.rows, self.hexGameMap.cols,
        drawnLines, drawnHexes
      );

      // then draw objects
      self.renderObjects(ctx, hex, rowIdx, colIdx);

      if (colIdx === self.right - 1) {
        currentWest = [
          10,
          10 + GameMap.SIDE_THREE + ((rowIdx - self.upper + 1) * GameMap.SIDE_THREE * 2)
        ];

      } else if (colIdx % 2 === 0) {
        currentWest = vertices.SE;

      } else {
        currentWest = vertices.NE;
      }

    },

    {
      upperLeft: [self.upper, self.left],
      lowerRight: [self.lower, self.right]
    }
  );
};

// window.findPath = require('../util/helpers').findPath;
module.exports = GameMap;
