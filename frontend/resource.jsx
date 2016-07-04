var React = require('react'),
    ReactDOM = require('react-dom'),
    Creature = require('./game/Creature'),
    Move = require('./game/Move'),
    Battlefield = require('./game/Battlefield'),
    GameMap = require('./game/GameMap');

require('./util/PathFinder.js');

window.DIM_X = 1250;
window.DIM_Y = 800;

var App = React.createClass({
  startGame: function () {
    this.context.fillRect(0, 0, window.DIM_X, window.DIM_Y);

    var settlement = { image: window.resourceImages.icons.settlement };
    this.map.placeVisitableObjectAt(0, 0, settlement);
    this.map.placeVisitableObjectAt(4, 4, settlement);
    this.map.placeVisitableObjectAt(4, 5, settlement);
    this.map.placeVisitableObjectAt(4, 6, settlement);
    this.map.placeVisitableObjectAt(4, 3, settlement);
    this.map.placeVisitableObjectAt(4, 2, settlement);
    this.map.placeVisitableObjectAt(5, 2, settlement);
    this.map.placeVisitableObjectAt(6, 2, settlement);

    this.map.placeCreatureAt(0, 1, new Creature(
      'humanoid', 'dark', {}, {},
      window.resourceImages.sprites.darkElemental
    ));

    this.map.placeCreatureAt(1, 2, new Creature(
      'humanoid', 'fire', {}, {},
      window.resourceImages.sprites.fireElemental
    ));

    this.map.render(this.context);
  },

  componentDidMount: function () {
    this.context = document.getElementById("test").getContext('2d');
    this.context.fillStyle = "rgb(255, 255, 255)";
    this.map = new GameMap();
    window.map = this.map;
    this.loadImages();
  },

  loadImages: function () {
    var loadFolder = function (fnameSources) {
      var fnameImages = fnameSources.replace("Sources", "") + "s";
      window.resourceImages[fnameImages] = {};

      Object.keys(window.resourceImages[fnameSources]).forEach(function (source) {
        var img = new Image();
        img.src = window.resourceImages[fnameSources][source];

        img.onload = function () {
          window.resourceImages[fnameImages][source] = img;
          this.loadedImages++;

          this.context.fillRect(0, 0, window.DIM_X, window.DIM_Y);

          this.context.font = '48px sans serif';
          this.context.strokeText(
            this.loadedImages + " / " + this.loaderCount + " loaded",
            window.DIM_X / 2, window.DIM_Y / 2
          );

          if (this.loadedImages == this.loaderCount) {
            setTimeout(this.startGame, 350);
          }
        }.bind(this)
      }.bind(this));
    }.bind(this);

    this.loaderCount =
    Object.keys(window.resourceImages.spriteSources).length +
    Object.keys(window.resourceImages.iconSources).length;

    this.loadedImages = 0;

    loadFolder('spriteSources');
    loadFolder('iconSources');
  },

  handleClick: function (evnt) {
    if (this.map.handleClick(evnt)) {
      // for now just rerender the map, but we can do better
      this.map.render(this.context);
    }
  },

  handleKey: function (evnt) {
    switch (evnt.key) {
      case "m":
        if (this.map.move()) {
          this.map.render(this.context);
        }
        break;
    }
  },

  render: function () {
    return(
      <div onKeyDown={this.handleKey}>
        <canvas
          tabIndex="1"
          id="test" width={window.DIM_X} height={window.DIM_Y}
          onClick={this.handleClick}
        ></canvas>
      </div>
    );
  }
});

document.addEventListener(
  "DOMContentLoaded",
  function () { ReactDOM.render(< App />, document.getElementById('app')); }
);
