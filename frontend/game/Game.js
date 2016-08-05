var Creature = require('./Creature'),
    Move = require('./Move'),
    Battlefield = require('./Battlefield'),
    NavMap = require('./NavMap'),
    GameMap = require('./GameMap'),
    VoronoiGenerator = require('../util/VoronoiGenerator.js'),
    MapGenerator = require('../util/MapGenerator.js');

function Game(ctx) {
  this.ctx = ctx;

  // var gResult = generateMap(70, 70, 4);
  var gResult = VoronoiGenerator(70, 70, 4);
  this.map = new GameMap(gResult.grid);
  this.nav = new NavMap(this.map);

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

module.exports = Game;
