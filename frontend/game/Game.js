var Settlement = require('./Settlement'),
    NavMap = require('./NavMap'),
    GameMap = require('./GameMap'),
    Types = require('../constants/types.js'),
    helpers = require('../util/helpers.js'),
    VoronoiGenerator = require('../util/VoronoiGenerator.js'),
    placeObjects = require('../util/ObjectPlacer.js');

function Game(ctx) {
  this.ctx = ctx;

  console.log('making game');
  // var gResult = generateMap(70, 70, 4);
  var gResult = VoronoiGenerator(70, 70, 4);
  this.map = new GameMap(gResult.grid);
  this.nav = new NavMap(this.map);

  placeObjects(this.map, gResult.zones, makeSettlement);

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

  var total_population = 0;
  var populations = {};

  if (tile.type !== 'mountain' && tile.type !== 'water') {
    var rates = Types.occurrenceRates[tile.type];
    // console.log(tile.type);
    // console.log(rates);
    var creatureTypes = Object.keys(rates);
    var total = 0;
    var weights = creatureTypes.map(
      function (creatureType) {
        var weight = rates[creatureType];
        total += weight;
        return weight;
      }
    );

    while (total_population < 100) {
      var creatureChoice = helpers.weightedRandomChoice(
        creatureTypes, weights, total
      );
      populations[creatureChoice] = populations[creatureChoice] || 0;
      populations[creatureChoice]++;
      total_population++;
    }

    // console.log(`settlement placed at ${point}`);
    tile.settlement = new Settlement({
      grid: gameMap.hexGameMap,
      tile: tile,
      point: point
    }, populations);
  }

};

// var gResult = VoronoiGenerator(70, 70, 4);
// // console.log(gResult.grid);
// var map = new GameMap(gResult.grid);
// // console.log(gResult.zones);
// var zones = Object.keys(gResult.zones);
// var zone = JSON.parse(zones[0]);
// // console.log(zone);
// var settlement = makeSettlement(map, zone.point);

module.exports = Game;
