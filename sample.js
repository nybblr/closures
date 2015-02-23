var outer = function (x, y) {
  var inner = function (x, z) {
    return [x, y, z];
  };
  return inner;
};

console.log(outer(1,2)(3,4));
