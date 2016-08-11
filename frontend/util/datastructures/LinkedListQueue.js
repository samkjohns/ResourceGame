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

module.exports = LinkedListQueue;
