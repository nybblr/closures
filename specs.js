var expect = chai.expect;

describe('Scope', function () {
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

describe('ScopePrinter', function () {
  it('should include locals', function () {
    var scope = new Scope();
    scope.set('a', 1);
    scope.set('b', 2);

    var print = scope.print();

    expect(print).to.deep.eql({a: 1, b: 2});
  });
});
