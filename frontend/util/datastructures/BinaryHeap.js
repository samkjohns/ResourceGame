function BinaryHeap(comparator) {
  this.comparator = comparator;
  this.tree = [];
  this.size = 0;
}

BinaryHeap.minHeap = function(v1, v2) {
  if (v1 < v2) return -1;
  if (v1 > v2) return 1;
  return 0;
};

BinaryHeap.maxHeap = function(v1, v2) {
  if (v1 < v2) return 1;
  if (v1 > v2) return -1;
  return 0;
};

BinaryHeap.prototype.empty = function () {
  return this.size === 0;
};

BinaryHeap.prototype.insert = function (val) {
  var hole = ++this.size;
  this.tree[hole] = val;

  var parent = Math.floor(hole / 2);
  while (hole > 1 && this.comparator(val, this.tree[parent]) === -1) {
    this.tree[hole] = this.tree[parent];
    hole = Math.floor(hole / 2);
    parent = Math.floor(hole / 2);
  }

  this.tree[hole] = val;
};

BinaryHeap.prototype.deleteTop = function () {
  var top = this.tree[1];
  this.tree[1] = this.tree[this.size];
  this._percolateDown(1);
  this.tree[this.size] = null;
  this.size--;
  return top;
};

BinaryHeap.prototype._percolateDown = function (hole) {
  var tree = this.tree;
  var compare = this.comparator;

  var child;
  var tmp = tree[hole];

  while ((hole * 2) <= this.size) {
    child = hole * 2;
    if (child !== this.size && compare(tree[child + 1], tree[child]) === -1)
      child++;
    if (compare(tree[child], tmp) === -1)
      tree[hole] = tree[child];
    else
      break;
    hole = child;
  }

  tree[hole] = tmp;
};

module.exports = BinaryHeap;
