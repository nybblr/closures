var ClosureRegistry = (function() {
  function ClosureRegistry() {
    this._registry = [new Scope()];
  }

  delegate(['get', 'set', 'args'], {
    from: ClosureRegistry.prototype,
    to: function() { return this.scopeForCurrentClosure(); }
  });

  delegate(['push', 'pop'], {
    from: ClosureRegistry.prototype,
    to: function() { return this._registry; }
  });

  ClosureRegistry.prototype.scopeForCurrentClosure = function() {
    return this._registry[this._registry.length - 1];
  };

  ClosureRegistry.prototype.func = function(name, params, body) {
    var _this = this;
    var scope = this.scopeForCurrentClosure().fork();
    this.set(name, function() {
      _this.push(scope);
      _this.args(params, arguments);
      var result = body();
      _this.pop();
      return result;
    });
  };

  return ClosureRegistry;
}());

var Scope = (function() {
  function Scope(dict) {
    this._dict = dict || {};
  }

  Scope.prototype._forkDict = function() {
    var dict = this._dict;
    var newDict = Object.create(dict);
    newDict.__parent = dict;
    return newDict;
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
    for (var i = 0, l = names.length; i < l; i++) {
      this.set(names[i], values[i]);
    }
  };

  return Scope;
}());
