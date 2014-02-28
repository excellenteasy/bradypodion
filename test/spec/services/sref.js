describe('srefService', function() {
  var ctrl, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, bpSref) {
    scope = $rootScope.$new()
    ctrl = bpSref
  }))

  describe('controller', function() {
    it('should parse state name', function() {
      var ref = ctrl.parse('foo', scope)
      expect(ref.state).toBe('foo')
      ref = ctrl.parse('bar({bar: 1})', scope)
      expect(ref.state).toBe('bar')
    })

    it('should parse state params', function() {
      var ref = ctrl.parse('foo', scope)
      expect(ref.params).toBe(null)
      ref = ctrl.parse('bar({bar: 1})', scope)
      expect(ref.params).toEqual({bar: 1})
      scope.baz = {baz: 2}
      ref = ctrl.parse('bar(baz)', scope)
      expect(ref.params).toEqual({baz: 2})
    })
  })
})
