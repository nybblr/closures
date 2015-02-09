var Scope = (function (global) {
  function Scope() {
    this._root = {};
    this._closure = null;
    this._scopes = {};
  };

  Scope.prototype.current = function () {
    if (this._closure == null) {
      return this._root;
    }
    return this._scopes[this._closure.uniqueId];
  };

  Scope.prototype.setCurrent = function (scope) {
    this._scopes[this._closure.uniqueId] = scope;
  };

  Scope.prototype.fork = function () {
    var previousScope = this.current();
    var F = function () {};
    F.prototype = Object.create(previousScope);
    F.prototype.constructor = F;
    F.prototype.parent = previousScope;
    return new F();
  }

  Scope.prototype.push = function (scope, func) {
    var previousClosure = this._closure;
    var newScope = scope;
    this._closure = func;
    this.setCurrent(newScope);
    return previousClosure;
  };

  Scope.prototype.pop = function (closure) {
    // var parent = this.current().parent;
    // if (!!parent) {
    //   this.setCurrent(parent);
    // }
    // return !!parent;
    this._closure = closure;
  };

  Scope.prototype.set = function (key, value) {
    this.current()[key] = value;
  };

  Scope.prototype.get = function (key) {
    return this.current()[key];
  };

  Scope.prototype.args = function (names, values) {
    for (var i = 0; i < names.length; i++) {
      this.set(names[i], values[i]);
    }
  };

  Scope.prototype.func = function (name, args, body) {
    var _this = this;
    var scope = this.fork()
    var f = function () {
      var s = _this.push(scope, f);
      _this.args(args, arguments);
      var r = body.apply(this);
      _this.pop(s);
      return r;
    }

    this.set(name, f);
  }

  return Scope;
})(window);

var scope = new Scope();
var push = function ()  { return scope.push() };
var pop  = function ()  { return scope.pop() };
var s = function (k, v) { return scope.set(k, v) };
var g = function (k)    { return scope.get(k) };
var f = function (n, a, b) { return scope.func(n, a, b) };

// var outer = function (x, y) {
//   var inner = function (x, z) {
//     return [x, y, z];
//   };
//   return inner;
// };
//
// console.log(outer(1,2)(3,4));

// f('outer', ['x', 'y'], function () {
//   f('inner', ['x', 'z'], function () {
//     return [g('x'), g('y'), g('z')];
//   });
//
//   return g('inner');
// });
//
// console.log(g('outer')(1,2)(3,4));
