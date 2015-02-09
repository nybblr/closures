var Scope = (function (global) {
  function Scope() {
    this._scope = {};
  };

  Scope.prototype.current = function () {
    return this._scope;
  };

  Scope.prototype.push = function () {
    var F = function () {};
    F.prototype = Object.create(this._scope);
    F.prototype.constructor = F;
    F.prototype.parent = this._scope;
    this._scope = new F();
  };

  Scope.prototype.pop = function () {
    var parent = this._scope.parent;
    if (!!parent) {
      this._scope = parent;
    }
    return !!parent;
  };

  Scope.prototype.set = function (key, value) {
    this.current()[key] = value;
  };

  Scope.prototype.get = function (key) {
    return this.current()[key];
  };

  Scope.prototype.args = function (args) {
    for (var i = 0; i < args.length; i++) {
      this.set(args[i], undefined);
    }
  };

  return Scope;
})(window);

var scope = new Scope();
var args = function (a) { return scope.args(a) };
var push = function ()  { return scope.push() };
var pop  = function ()  { return scope.pop() };
var s = function (k, v) { return scope.set(k, v) };
var g = function (k)    { return scope.get(k) };

// var outer = function (x, y) {
//   var inner = function (x, z) {
//     return [x, y, z];
//   };
//   return inner;
// };
//
// console.log(outer(1,2)(3,4));

// push();
// s('x',1);
// s('y',2);
// push();
// s('x',3);
// s('z',4);
//
// console.log([g('x'), g('y'), g('z')]);
//
// pop();
// pop();

// s('outer', function () {
//   push();
//   args(['x', 'y']);
//   s('inner', function () {
//     args(['x', 'z']);
//     return [g('x'), g('y'), g('z')];
//   });
//   pop();
//   return g('inner');
// });
// pop();
//
// console.log(g('outer')(1,2)(3,4));
