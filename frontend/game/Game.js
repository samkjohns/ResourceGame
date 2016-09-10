var Settlement = require('./Settlement'),
    NavMap = require('./NavMap'),
    GameMap = require('./GameMap'),
    Types = require('../constants/types.js'),
    helpers = require('../util/helpers.js'),
    VoronoiGenerator = require('../util/VoronoiGenerator.js'),
    sweepMapGenerator = require('../util/SweepMap'),
    placeObjects = require('../util/ObjectPlacer.js');

function Game(ctx, options) {
  this.ctx = ctx;
  this.options = Game.defaultOptions;
  if (options) helpers.objectMerge(this.options, options);

  var size = Game.dimensions[this.options.size];
  this.ySize = size[0];
  this.xSize = size[1];

  var gResult = sweepMapGenerator(this.ySize, this.xSize, this.options.numPlayers);
  this.map = new GameMap(gResult.grid);
  // this.map.placeCreatureAt(0, 0, { // for testing
  //   image: window.resourceImages.sprites.darkElemental
  // });

  this.nav = new NavMap(this.map);
  this.battle = null;

  this.startingPlaces = gResult.zones.map(function (zone) {
    return {
      point: zone.origin,
      player: null
    };
  });

  this.human = new HumanPlayer('Sam', Game.playerColors[0]);
  var humanStart = this.randomStartingPlace();
  this.human.setStart(this.map, humanStart);
  this.map.discover(humanStart);
  this.map.focusOn(humanStart);

  this.computers = [];
  var color, player, start, tileType;
  for (var i = 0; i < this.options.numPlayers; i++) {
    color = Game.playerColors[i + 1];
    player = new ComputerPlayer(color);

    start = this.randomStartingPlace();
    player.setStart(this.map, start);

    computers.push(player);
  }

  // placeObjects(this.map, gResult.zones, makeSettlement);

  this.canvasRender();
}

Game.defaultOptions = {
  numPlayers: 2,
  size: 'medium'
};

Game.dimensions = {
  small:      [50,  60],
  medium:     [75,  90],
  large:      [100, 120],
  extraLarge: [150, 180]
};

Game.playerColors = [
  'red', 'blue', 'green', 'purple', 'orange', 'yellow'
];

Game.prototype.placeOpen = function (place) {
  var players = [this.human].concat(this.computers);
  return !!players.find(function (player) {
    return player.start[0] === place[0] && player.start[1] === place[1];
  });
};

Game.prototype.randomStartingPlace = function () {
  var positions = this.startingPlaces.filter(this.placeOpen.bind(this));
  return helpers.randomChoice(positions);
};

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
