describe('Scope', function () {
  it('should work with IIFEs', function () {
    expect(g('a')).to.eql(undefined);
    expect(g('b')).to.eql(undefined);
    expect(g('c')).to.eql(undefined);

    f('outer', ['a', 'b'], function () {

      expect(g('a')).to.eql(1);
      expect(g('b')).to.eql(2);
      expect(g('c')).to.eql(undefined);

      f('inner', ['a', 'c'], function () {

        expect(g('a')).to.eql(3);
        expect(g('b')).to.eql(2);
        expect(g('c')).to.eql(4);

      });

      g('inner')(3,4);

      expect(g('a')).to.eql(1);
      expect(g('b')).to.eql(2);
      expect(g('c')).to.eql(undefined);

    });

    g('outer')(1,2);

    expect(g('a')).to.eql(undefined);
    expect(g('b')).to.eql(undefined);
    expect(g('c')).to.eql(undefined);
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
