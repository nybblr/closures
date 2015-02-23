var GlobalScope = (function (global) {
  function GlobalScope() {
    this._closure = { uniqueId: 'global' };
    this._scopes = { global: new Scope(null) };
  }

  GlobalScope.prototype.scopeForCurrentClosure = function () {
    return this._scopes[this._closure.uniqueId];
  };

  GlobalScope.prototype.setScopeForCurrentClosure = function (scope) {
    this._scopes[this._closure.uniqueId] = scope;
  };

  GlobalScope.prototype.push = function (scope, func) {
    var previousClosure = this._closure;
    this._closure = func;
    this.setScopeForCurrentClosure(scope);
    return previousClosure;
  };

  GlobalScope.prototype.pop = function (closure) {
    this._closure = closure;
  };

  GlobalScope.prototype.set = function (key, value) {
    return this.scopeForCurrentClosure().set(key, value);
  };

  GlobalScope.prototype.get = function (key) {
    return this.scopeForCurrentClosure().get(key);
  };

  GlobalScope.prototype.args = function (names, values) {
    return this.scopeForCurrentClosure().args(names, values);
  };

  GlobalScope.prototype.func = function (name, args, body) {
    var _this = this;
    var previousScope = this.scopeForCurrentClosure();
    var scope = previousScope.fork();
    var f = function () {
      var previousClosure = _this.push(scope, f);
      _this.args(args, arguments);
      var result = body.apply(this);
      _this.pop(previousClosure);
      return result;
    };

    this.set(name, f);
  };

  return GlobalScope;
})(window);

var Scope = (function (global) {
  function Scope(object) {
    this._scope = object || {};
  }

  Scope.prototype._forkScope = function () {
    var scope = this._scope;
    var F = function () {};
    F.prototype = Object.create(scope);
    F.prototype.constructor = F;
    F.prototype.__parent = this;
    return new F();
  };

  Scope.prototype.fork = function () {
    return new Scope(this._forkScope());
  };

  Scope.prototype.parent = function () {
    return this._scope.__parent;
  };

  Scope.prototype.locals = function () {
    var locals = Object.keys(this._scope);

    return locals;
  };

  Scope.prototype.localsObject = function () {
    var locals = this.locals();
    var count = locals.length;
    var object = {};

    for (var i = 0; i < count; i++) {
      var local = locals[i];
      object[local] = this.get(local);
    }

    return object;
  };

  Scope.prototype.print = function () {
    var printer = new ScopePrinter(this);
    return printer.print();
  };

  Scope.prototype.set = function (key, value) {
    this._scope[key] = value;
  };

  Scope.prototype.get = function (key) {
    return this._scope[key];
  };

  Scope.prototype.args = function (names, values) {
    for (var i = 0; i < names.length; i++) {
      this.set(names[i], values[i]);
    }
  };

  return Scope;
})(window);

var ScopePrinter = (function (global) {
  function ScopePrinter(scope) {
    this._scope = scope;
  }

  ScopePrinter.prototype.print = function () {
    return this._print(this._scope);
  };

  ScopePrinter.prototype._print = function (scope) {
    if (scope == null) {
      return null;
    }

    var localsObject = scope.localsObject();

    var parent = scope.parent();

    if (parent != null) {
      localsObject._parent = this._print(parent);
    }

    return localsObject;
  };

  return ScopePrinter;
})(window);

var scope = new GlobalScope();
var s = scope.set.bind(scope);
var g = scope.get.bind(scope);
var f = scope.func.bind(scope);

// var outer = function (x, y) {
//   var inner = function (x, z) {
//     return [x, y, z];
//   };
//   return inner;
// };
//
// console.log(outer(1,2)(3,4));
