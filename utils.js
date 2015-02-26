var delegate = function(methods, opts) {
  var from = opts.from, to = opts.to;
  methods.forEach(function(method) {
    from[method] = function() {
      var target = to.apply(this);
      return target[method].apply(target, arguments);
    };
  });
};
