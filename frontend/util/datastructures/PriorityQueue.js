var BinaryHeap = require('./BinaryHeap.js');

function PriorityQueue(prioritizer) {
  this.heap = new BinaryHeap(PriorityQueue.comparator);
  this.prioritizer = prioritizer; // function that assigns priorities to values
};

PriorityQueue.comparator = function (o1, o2) {
  const priority1 = o1.priority;
  const priority2 = o2.priority;

  return BinaryHeap.maxHeap(priority1, priority2);
};

PriorityQueue.prototype.empty = function () {
  return this.heap.empty();
};

PriorityQueue.prototype.enqueue = function (val) {
  var priority = this.prioritizer(val);
  this.heap.insert({val: val, priority: priority});
};

PriorityQueue.prototype.dequeue = function () {
  var head = this.heap.deleteTop();
  return head.val;
};

module.exports = PriorityQueue;
