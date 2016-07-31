var HelperUtil = module.exports = {
  objectUnion: function (ob1, ob2) {
    output = {};

    // duplicate ob1
    Object.keys(ob1).forEach(function (key) {
      output[key] = ob1[key];
    });

    // merge with ob2
    Object.keys(ob2).forEach(function (key) {
      output[key] = ob2[key];
    });

    return output;
  },

  objectMerge: function (ob1, ob2) {
    Object.keys(ob2).forEach(function (key) {
      ob1[key] = ob2[key];
    });
  },

  debug_log: function (flag, message) {
    if (flag) console.log(message);
  }
};
