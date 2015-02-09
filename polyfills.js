(function() {
  var id_counter = 1;
  Object.defineProperty(Object.prototype, "__uniqueId", {
    writable: true
  });
  Object.defineProperty(Object.prototype, "uniqueId", {
    get: function() {
      if (this.__uniqueId == undefined) {
        this.__uniqueId = id_counter++;
      }
      return this.__uniqueId;
    }
  });
}());
