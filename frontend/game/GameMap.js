var testGameMap = require('./resources/testmap');
var breadthFirstPath = require('../util/PathFinder.js');

function GameMap () {
  this.hexGameMap = testGameMap;
  this.creatureSelection = null;
}

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
    evnt,
    GameMap.EDGE_LENGTH,
    10, 10
  );
  var hexVal = selection.hex;
  if (!hexVal) { return false; }

  if (this.creatureSelection) {

    // if the click is on a selected creature, deselect
    if (hexVal.creature === this.creatureSelection) {
      this.creatureSelection = null;
      this.resetPath();
      return false;

    // else set a path to the clicked destination
    } else {
      var path = breadthFirstPath(
        this.hexGameMap,
        this.creatureSelection.hexCoords,
        [selection.row, selection.col]
      );

      this.setSelectedPathTo(path);
      return path && path.length > 0;
    }

  } else if (hexVal.creature) {
    this.creatureSelection = {
      creature: hexVal.creature,
      hexCoords: [selection.row, selection.col]
    }

    return false;
  }
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

    return true;
  } return false;
};

GameMap.prototype.getFillType = function (hex, type) {
  return hex.inPath ? "rgba(255, 0, 0, .5)" : GameMap.colors[hex.type];
};

GameMap.prototype.renderObjects = function (ctx, hex, rowIdx, colIdx) {
  var nwX, nwY;
  nwX = (colIdx * (GameMap.EDGE_LENGTH + GameMap.HALF_EDGE)) + 8;
  if (colIdx % 2 === 0) {
    nwY = (rowIdx * GameMap.SIDE_THREE * 2) + 14;
  } else {
    nwY = (rowIdx * GameMap.SIDE_THREE * 2) + 12 + GameMap.EDGE_LENGTH;
  }

  var upperLeft = [nwX + GameMap.HALF_EDGE, nwY];

  hex.object &&
  ctx.drawImage(hex.object.image, upperLeft[0], upperLeft[1], 25, 25);

  hex.creature &&
  ctx.drawImage(hex.creature.image, upperLeft[0], upperLeft[1], 25, 25);
};

GameMap.prototype.render = function (ctx) {
  var drawnLines = {};
  var drawnHexes = {};
  var self = this;

  function drawHex (west, hex) {
    var startX = west[0];
    var startY = west[1];
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

      ctx.fillStyle = self.getFillType(hex);
      // ctx.fillStyle = GameMap.colors[hex.type];
      ctx.fill();

      drawnHexes[hexJSON] = true;
    }

    return vertices;
  }

  var vertices;
  var currentWest = [10, 10 + GameMap.SIDE_THREE];

  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(0, 0, window.DIM_X, window.DIM_Y)

  // first draw tiles
  this.hexGameMap.forEach(function (hex, rowIdx, colIdx) {
    vertices = drawHex(currentWest, hex);

    if (colIdx === this.hexGameMap.cols - 1) {
      currentWest = [
        10,
        10 + GameMap.SIDE_THREE + ((rowIdx + 1) * GameMap.SIDE_THREE * 2)
      ];

    } else if (colIdx % 2 === 0) {
      currentWest = vertices.SE;

    } else {
      currentWest = vertices.NE;
    }

  }.bind(this));

  var west = [10, 10 + GameMap.SIDE_THREE];
  // then draw objects
  this.hexGameMap.forEach(function (hex, rowIdx, colIdx) {
    this.renderObjects(ctx, hex, rowIdx, colIdx);
  }.bind(this));
};

// window.findPath = require('../util/helpers').findPath;
module.exports = GameMap;
