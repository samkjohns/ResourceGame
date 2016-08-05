var helpers = require('./helpers.js');

function validPlacement(chosenTiles, tileJSON, minDistance) {
  var tile = JSON.parse(tileJSON);
  if (tile.type === 'mountain' || tile.type === 'water') return false;
  if (chosenTiles.length === 0) return true;
  if (chosenTiles.indexOf(tileJSON) > -1) return false;


  var tooClose = chosenTiles.some(
    function (chosenJSON) {
      var chosen = JSON.parse(chosenJSON);
      var distance = helpers.distance(tile, chosen);
      return distance < minDistance;
    }
  );

  return !tooClose;
}

function placeObjects(gameMap, zones, makeSettlement) {
  console.log('placing objects');

  // place settlements, 1 per 50 tiles in a zone
  Object.keys(zones).forEach(function (originJSON) {
    var tilesInZone = Object.keys(zones[originJSON]);
    var numTiles = tilesInZone.length;
    // var numSettlements = Math.floor(numTiles / 200);
    var numSettlements = 1;
    var chosenTiles = [];

    while (chosenTiles.length < numSettlements) {
      var randIdx = helpers.randInRange(0, numTiles);
      var tileJSON = tilesInZone[randIdx];
      var minDistance = (numSettlements - 1) * 3;

      // debugger

      if (validPlacement(chosenTiles, tileJSON, minDistance)) {
        chosenTiles.push(tileJSON);
      }
    }

    chosenTiles.forEach(function (chosenJSON) {
      var chosen = JSON.parse(chosenJSON);
      makeSettlement(gameMap, chosen);
    });
  })
}

module.exports = placeObjects;
