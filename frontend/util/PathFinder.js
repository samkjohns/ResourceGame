function LinkedListQueue() {
  this.head = null;
  this.tail = null;
}

LinkedListQueue.prototype.empty = function () {
  return !this.head;
};

LinkedListQueue.prototype.enqueue = function (val) {
  var node = {
    val: val,
    prev: null,
    next: this.head
  };

  if (this.head) {
    this.head.prev = node;
  } else {
    this.tail = node;
  }
  this.head = node;

  return this.head;
};

LinkedListQueue.prototype.dequeue = function () {
  if (this.tail) {
    var val = this.tail.val;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    }

    return val;
  } return null;
};

// Breadth-first
function breadthFirstPath(hexGrid, start, goal, isObstacle) {
  // console.log('finding path');
  var frontier = new LinkedListQueue();
  frontier.enqueue(start);
  var cameFrom = {};
  var startKey = JSON.stringify(start);
  var goalKey = JSON.stringify(goal);
  cameFrom[startKey] = null;

  var current, currentKey;
  while(!frontier.empty()) {
    current = frontier.dequeue();
    currentKey = JSON.stringify(current);

    if (currentKey === goalKey) {
      return _reconstructPath(cameFrom, current);
    }

    var neighbors = hexGrid.neighborCoords(current[0], current[1]);

    var neighborKey;
    neighbors.forEach(function (neighbor) {
      var tile = hexGrid.valueAt(neighbor);

      var neighborKey = JSON.stringify(neighbor);
      if(!isObstacle(tile) || neighborKey === goalKey) {
        if(!cameFrom[neighborKey] && cameFrom[neighborKey] !== null) {
          frontier.enqueue(neighbor);
          cameFrom[neighborKey] = current;
        }
      }
    });
  }

  return null;
}


// helper function
function _reconstructPath(cameFrom, current) {
  // console.log('found a path');
  var currentKey = JSON.stringify(current);
  var totalPath = [current];

  while (cameFrom[currentKey]) {
    current = cameFrom[currentKey];
    currentKey = JSON.stringify(current);
    totalPath.push(current);
  }

  return totalPath;
}

// var HexGrid = require('./HexGrid.js');
// var grid = new HexGrid(5, 5);
// for (var i = 0; i < 5; i++) {
//   for (var j = 0; j < 5; j++) {
//     grid.setValue([i, j], {occupied: false});
//   }
// }
// grid.valueAt(1, 1).occupied = true;
// grid.valueAt(1, 2).occupied = true;
// grid.valueAt(2, 1).occupied = true;
//
// var path = breadthFirstPath(grid, [0, 0], [4, 4]);
// if (path) {
//   path.forEach(function (coords) {
//     console.log(coords);
//   });
// } else {
//   console.log("no path");
// }

module.exports = breadthFirstPath;

/*
// A*
// start and goal are a [row, col]
// if values are important, we can use the hexGrid to get them
function findPath(hexGrid, start, goal) {
  var startKey = JSON.stringify(start);
  var goalKey = JSON.stringify(goal);

  // The set of nodes already evaluated.
  var closedSet = {};

  // The set of currently discovered nodes still to be evaluated.
  // Initially, only the start node is known.
  var openSet = { startKey: true };

  // For each node, which node it can most efficiently be reached from.
  // If a node can be reached from many nodes, cameFrom will eventually contain the
  // most efficient previous step.
  var cameFrom = {};

  // For each node, the cost of getting from the start node to that node.
  // default value of Infinity (assume undefined is infinity)
  // The cost of going from start to start is zero.
  var gScore = { startKey: 0 };

  function heuristicCostEstimate(from) {
    // return some number -- distance maybe?
    var dRow = Math.abs(from[0] - goal[0]);
    var dCol = Math.abs(from[1] - goal[1]);

    return Math.sqrt(Math.pow(dRow, 2) + Math.pow(dCol, 2));
  }

  // For each node, the total cost of getting from the start node to the goal
  // by passing by that node. That value is partly known, partly heuristic.
  // For the first node, that value is completely heuristic.
  // default value is infinity
  var fScore = { startKey: heuristicCostEstimate(start) }

  var openNodes = Object.keys(openSet);
  while(openNodes.length > 0) {
    var current = openNodes.sort(function (hex1, hex2) {
      var json1 = JSON.stringify(hex1);
      var json2 = JSON.stringify(hex2);

      var fScore1 = fScore[json1];
      var fScore2 = fScore[json2];

      if (fScore1 && fScore2) {
        if (fScore1 < fScore2) {
          return -1;
        } else if (fScore1 > fScore2) {
          return 1;
        } return 0;

      } else if (fScore1) {
        // fScore1 is a value, and fScore2 is infinity
        return 1;
      } else if (fScore2) {
        // fScore2 is a value, and fScore1 is infinity
        return -1;

        // fScore1 and fScore2 are both infinity, therefore equal
      } return 0;
    })[0]; // the first node is the one with the lowest fScore value

    openNodes = Object.keys(openSet);
  }

  var currentKey = JSON.stringify(current);
  if (currentKey === goalKey) {
    return _reconstructPath(cameFrom, current);
  }

  openSet[currentKey] = false;
  closedSet[currentKey] = true;

  var neighbors = hexGrid.neighborCoords(current);
  // neighbors.forEach(function (neighbor) {
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    var neighborKey = JSON.stringify(neighbor);
    if (closedSet[neighborKey]) { continue; } // Ignore the neighbor which is already evaluated.

    // The distance from start to a neighbor
    var tentativeGScore = gScore[currentKey] + heuristicCostEstimate(neighbor);
    if (!openSet[neighborKey]) {
      openSet[neighborKey]; // discover a new node
    } else if (gScore[neighborKey] && tentativeGScore >= gScore[neighborKey]) {
      continue; // this is not a better path
    }

    // this path is the best until now. Record it!
    cameFrom[neighborKey] = currentKey;
    gScore[neighborKey] = tentativeGScore;
    fScore[neighborKey] = gScore[neighborKey] + heuristicCostEstimate(neighbor);
  }

  return null; // failure
}
*/
