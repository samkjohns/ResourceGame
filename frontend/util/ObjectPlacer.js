function tilesInOrigin(grid, origin) {
  var tiles = [];
  var borderTiles = [];

  grid.forEach(function (tile, i, j) {
    if (tile.type !== 'mountain') {
      var zRow = tile._zone[0];
      var zCol = tile._zone[1];
      if (zRow === origin[0] && zCol === origin[1]) {
        tiles.push(tile);
      }
    }
  });

  return tiles;
}

function placeObjects(grid, zoneOrigins) {
  var zones = zoneOrigins.map(
    function (origin) {
      return tilesInOrigin(grid, origin);
    }
  );


}
