var HexUtil = {
  addPoints: function (p1, p2) {
    return [
      p1[0] + p2[0],
      p1[1] + p2[1]
    ];
  },

  centroid: function (points) {
    var k = points.length;
    var pointSum = points.reduce(function (acc, point) {
      return HexUtil.addPoints(acc, point);
    }, [0, 0]);

    return [
      pointSum[0] / k,
      pointSum[1] / k
    ];
  },

  moveTo: function moveTo(ctx, point) {
    ctx.moveTo(point[0], point[1]);
  },

  lineTo: function lineTo(ctx, drawnLines, from, to) {
    var lineJSON = JSON.stringify({
      from: from,
      to: to
    });

    if (!drawnLines[lineJSON]) {
      ctx.lineTo(to.point[0], to.point[1]);
      drawnLines[lineJSON] = true;
    }
  },

  drawHex: function (
    ctx, west, hex, edgeLength,
    row, col, maxRow, maxCol,
    drawnLines, drawnHexes,
    getStyles
  ) {

    var startX = west[0];
    var startY = west[1];

    var vertices = HexUtil.verticesFor(west, edgeLength);
    if (!hex) return vertices;

    var hexJSON = JSON.stringify(vertices);

    if (!drawnHexes[hexJSON]) {
      var upperLeft = [vertices.W[0], vertices.NW[1]];
      var lowerRight = [vertices.E[0], vertices.SE[1]];
      var size = [lowerRight[0] - upperLeft[0], lowerRight[1] - upperLeft[1]];
      var img = window.resourceImages.tiles[hex.type];
      ctx.drawImage(
        img,
        upperLeft[0], upperLeft[1],
        size[0], size[1]
      );

      if (hex.territoryOf || hex.settlement || hex.inPath) {
        ctx.beginPath();

        HexUtil.moveTo(ctx, west);
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'W', point: west},
          {loc: 'NW', point: vertices.NW}
        );
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'NW', point: vertices.NW},
          {loc: 'NE', point: vertices.NE}
        );
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'NE', point: vertices.NE},
          {loc: 'E', point: vertices.E}
        );
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'E', point: vertices.E},
          {loc: 'SE', point: vertices.SE}
        );
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'SE', point: vertices.SE},
          {loc: 'SW', point: vertices.SW}
        );
        HexUtil.lineTo(
          ctx, drawnLines,
          {loc: 'SW', point: vertices.SW},
          {loc: 'W', point: vertices.W}
        );

        // getStyles(ctx, hex, row, col, maxRow, maxCol);
        // ctx.stroke();
        ctx.fillStyle = 'rgba(200, 100, 100, .3)';
        ctx.fill();
      }

      drawnHexes[hexJSON] = true;
    }

    return vertices;
  },

  nextWest: function (
    current, row, col, upperRow, lastCol, startX, startY, sideThree, vertices
  ) {
    // console.log(`upperRow: ${upperRow}`);
    if (col === lastCol - 1) {
      var y = startY + ((row - upperRow + 1) * sideThree * 2);

      return [startX, y];

    } else if (col % 2 === 0) {
      return vertices.SE;

    } else {
      return vertices.NE;
    }
  },

  verticesFor: function (west, edgeLength) {
    var halfEdge = edgeLength / 2;
    var sideThree = Math.sqrt(3) * halfEdge;

    var startX = west[0];
    var startY = west[1];

    return {
      W: west,

      NW: [
        startX + halfEdge,
        startY - sideThree
      ],

      NE: [
        startX + halfEdge + edgeLength,
        startY - sideThree
      ],

      E: [
        startX + (2 * edgeLength),
        startY
      ],

      SW: [
        startX + halfEdge,
        startY + sideThree
      ],

      SE: [
        startX + halfEdge + edgeLength,
        startY + sideThree
      ]
    };
  }
};

module.exports = HexUtil;
