var ClosureRegistry = (function() {
  function ClosureRegistry() {
    this._closure = { uniqueId: 'global' };
    this._registry = { global: new Scope() };
  }

  delegate(['get', 'set', 'args'], {
    from: ClosureRegistry.prototype,
    to: function() { return this.scopeForCurrentClosure(); }
  });

  ClosureRegistry.prototype.scopeForCurrentClosure = function() {
    return this._registry[this._closure.uniqueId];
  };

  ClosureRegistry.prototype.setScopeForCurrentClosure = function(scope) {
    this._registry[this._closure.uniqueId] = scope;
  };

  ClosureRegistry.prototype.push = function(func, scope) {
    var previousClosure = this.pop(func);
    this.setScopeForCurrentClosure(scope);
    return previousClosure;
  };

  ClosureRegistry.prototype.pop = function(func) {
    var previousClosure = this._closure;
    this._closure = func;
    return previousClosure;
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

  return Scope;
}());
