var Scope = (function() {
  function Scope() {
    this._dict = {};
  }

  Scope.prototype.push = function() {
    this._dict = this._forkDict();
  };

  Scope.prototype.pop = function() {
    var parent = this._dict.__parent;
    if (parent) {
      this._dict = parent;
    }
    return !!parent;
  };

  Scope.prototype._forkDict = function() {
    var dict = this._dict;
    var F = function() {};
    F.prototype = Object.create(dict);
    F.prototype.constructor = F;
    F.prototype.__parent = dict;
    return new F();
  };

  Scope.prototype.get = function(key) {
    return this._dict[key];
  };

  Scope.prototype.set = function(key, value) {
    this._dict[key] = value;
  };

  return Scope;
}());
