var expect = chai.expect;

var scope, args, push, pop, s, g, f;

describe('Scope', function () {
  describe.skip('for a global context', function(){
    before(function(){
      scope = new Scope();
      s = scope.set.bind(scope);
      g = scope.get.bind(scope);
    });

    it('should retrieve set variables', function(){
      s('x',1);

      expect(g('x')).to.eql(1);
      expect(g('y')).to.eql(undefined);
    });
  });

  describe.skip('for a context', function(){
    before(function(){
      scope = new Scope();
      push = scope.push.bind(scope);
      pop = scope.pop.bind(scope);
      s = scope.set.bind(scope);
      g = scope.get.bind(scope);
    });

    it('should isolate variables from outer contexts', function(){
      expect(g('x')).to.eql(undefined);
      expect(g('y')).to.eql(undefined);

      push();
        s('x',1);
        s('y',2);

        expect(g('x')).to.eql(1);
        expect(g('y')).to.eql(2);
      pop();

      expect(g('x')).to.eql(undefined);
      expect(g('y')).to.eql(undefined);
    });

    it('should inherit variables from outer contexts', function(){
      s('x',1);
      s('y',2);

      push();
        s('z',3);

        expect(g('x')).to.eql(1);
        expect(g('y')).to.eql(2);
        expect(g('z')).to.eql(3);
      pop();
    });

    it('should allow variable shadowing', function(){
      s('x',1);

      push();
        s('x',3);

        expect(g('x')).to.eql(3);
      pop();

      expect(g('x')).to.eql(1);
    });
  });

  describe.skip('for a closure', function(){
    before(function(){
      registry = new ClosureRegistry();
      s = registry.set.bind(registry);
      g = registry.get.bind(registry);
      f = registry.func.bind(registry);
    });

    it('should work with IIFEs', function () {
      s('d', 5);

      expect(g('a')).to.eql(undefined);
      expect(g('b')).to.eql(undefined);
      expect(g('c')).to.eql(undefined);
      expect(g('d')).to.eql(5);

      f('outer', ['a', 'b'], function () {

        expect(g('a')).to.eql(1);
        expect(g('b')).to.eql(2);
        expect(g('c')).to.eql(undefined);
        expect(g('d')).to.eql(5);

        f('inner', ['a', 'c'], function () {

          expect(g('a')).to.eql(3);
          expect(g('b')).to.eql(2);
          expect(g('c')).to.eql(4);
          expect(g('d')).to.eql(5);

        });

        g('inner')(3,4);

        expect(g('a')).to.eql(1);
        expect(g('b')).to.eql(2);
        expect(g('c')).to.eql(undefined);
        expect(g('d')).to.eql(5);

      });

      g('outer')(1,2);

      expect(g('a')).to.eql(undefined);
      expect(g('b')).to.eql(undefined);
      expect(g('c')).to.eql(undefined);
      expect(g('d')).to.eql(5);
    });

    it('should remember scope when closure is invoked outside', function () {
      f('outer', ['x', 'y'], function () {
        f('inner', ['x', 'z'], function () {
          return [g('x'), g('y'), g('z')];
        });

        return g('inner');
      });

      // Should allow shadowing
      expect(g('outer')(1,2)(3,4)).to.eql([3,2,4]);

      // Shouldn't leak
      expect(g('x')).to.eql(undefined);
      expect(g('y')).to.eql(undefined);
      expect(g('z')).to.eql(undefined);
    });
  });
});
