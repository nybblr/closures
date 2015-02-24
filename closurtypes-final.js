var ClosureRegistry = (function() {
  function ClosureRegistry() {
    this._closure = { uniqueId: 'global' };
    this._registry = { global: new Scope() };
  }

  ClosureRegistry.prototype.scopeForCurrentClosure = function() {
    return this._registry[this._closure.uniqueId];
  };

  ClosureRegistry.prototype.setScopeForCurrentClosure = function(scope) {
    this._registry[this._closure.uniqueId] = scope;
  };

  ClosureRegistry.prototype.push = function(func, scope) {
    var previousClosure = this._closure;
    this._closure = func;
    this.setScopeForCurrentClosure(scope);
    return previousClosure;
  };

  ClosureRegistry.prototype.pop = function(func) {
    var previousClosure = this._closure;
    this._closure = func;
    return previousClosure;
  };

  ClosureRegistry.prototype.get = function(key) {
    return this.scopeForCurrentClosure().get(key);
  };

  ClosureRegistry.prototype.set = function(key, value) {
    return this.scopeForCurrentClosure().set(key, value);
  };

  ClosureRegistry.prototype.args = function(names, values) {
    return this.scopeForCurrentClosure().args(names, values);
  };

  ClosureRegistry.prototype.func = function(name, args, body) {
    var _this = this;
    var scope = this.scopeForCurrentClosure().fork();
    var f = function() {
      var previousClosure = _this.push(f, scope);
      _this.args(args, arguments);
      var result = body.apply(this);
      _this.pop(previousClosure);
      return result;
    };

    this.set(name, f);
  };

  return ClosureRegistry;
}());

var Scope = (function() {
  function Scope(dict) {
    this._dict = dict || {};
  }

  Scope.prototype._forkDict = function() {
    var dict = this._dict;
    var F = function() {};
    F.prototype = Object.create(dict);
    F.prototype.constructor = F;
    F.prototype.__parent = this;
    return new F();
  };

  Scope.prototype.fork = function() {
    return new Scope(this._forkDict());
  };

  Scope.prototype.get = function(key) {
    return this._dict[key];
  };

  Scope.prototype.set = function(key, value) {
    this._dict[key] = value;
  };

  Scope.prototype.args = function(names, values) {
    for (var i = 0, l = names.length; i < l; i ++) {
      this.set(names[i], values[i]);
    }
  };

  Scope.prototype.parent = function () {
    return this._dict.__parent;
  };

  Scope.prototype.locals = function () {
    return Object.keys(this._dict);
  };

  Scope.prototype.localsObject = function () {
    var locals = this.locals();
    var object = {};

    for (var i = 0, l = locals.length; i < l; i ++) {
      var local = locals[i];
      object[local] = this.get(local);
    }

    return object;
  };

  Scope.prototype.tree = function () {
    var visitor = new ScopeVisitor(this);
    return visitor.tree();
  };

  return Scope;
}());

var ScopeVisitor = (function () {
  function ScopeVisitor(scope) {
    this._scope = scope;
  }

  ScopeVisitor.prototype.tree = function() {
    return this._tree(this._scope);
  };

  ScopeVisitor.prototype._tree = function(scope) {
    if (scope == null) {
      return null;
    }

    var localsObject = scope.localsObject();
    var parent = scope.parent();

    if (parent != null) {
      localsObject._parent = this._tree(parent);
    }

    return localsObject;
  };

  return ScopeVisitor;
}());
