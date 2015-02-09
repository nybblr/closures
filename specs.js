describe('Scope', function () {
  it('should work', function () {
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
