var Settlement = require('./Settlement'),
    NavMap = require('./NavMap'),
    GameMap = require('./GameMap'),
    Types = require('../constants/types.js'),
    helpers = require('../util/helpers.js'),
    VoronoiGenerator = require('../util/VoronoiGenerator.js'),
    sweepMapGenerator = require('../util/SweepMap'),
    placeObjects = require('../util/ObjectPlacer.js');

function Game(ctx) {
  this.ctx = ctx;

  // var gResult = VoronoiGenerator(70, 70, 4);
  var gResult = sweepMapGenerator(70, 70, 4);
  this.map = new GameMap(gResult.grid);
  this.map.placeCreatureAt(0, 0, {
    image: window.resourceImages.sprites.darkElemental
  });
  this.nav = new NavMap(this.map);
  this.battle = null;

  // placeObjects(this.map, gResult.zones, makeSettlement);

  this.canvasRender();
}

Game.prototype.canvasRender = function () {
  this.map.render(this.ctx);
  this.nav.render(this.ctx);
};

Game.prototype.handleClick = function (evnt) {
  if (this.nav.handleClick(evnt, this.map) || this.map.handleClick(evnt)) {
    // for now just rerender the map, but we can do better
    this.canvasRender();
  }
};

Game.prototype.handleKey = function (evnt) {
  if (evnt.key.startsWith('Arrow')) {
    var dir = evnt.key.split('Arrow')[1];
    this.map.handleKey(dir, this.canvasRender.bind(this));

  } else if (evnt.key === "m") {
    this.map.move(this.canvasRender.bind(this));
  }
};

/* GAME LOGIC */

function makeSettlement(gameMap, point) {
  var tile = gameMap.hexGameMap.valueAt(point);

  if (tile.type !== 'mountain' && tile.type !== 'water') {
    tile.settlement = new Settlement(null, {
      grid: gameMap.hexGameMap,
      tile: tile,
      point: point
    }, 10);
  }

}

// var gResult = VoronoiGenerator(70, 70, 4);
// // console.log(gResult.grid);
// var map = new GameMap(gResult.grid);
// // console.log(gResult.zones);
// var zones = Object.keys(gResult.zones);
// var zone = JSON.parse(zones[0]);
// // console.log(zone);
// var settlement = makeSettlement(map, zone.point);

// var game = new Game();
// var settlement = makeSettlement(game.map, [0, 0]);

module.exports = Game;
