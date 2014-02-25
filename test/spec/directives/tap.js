describe('tapDirective', function() {
  var element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    scope.dummy = function() {}
    element = $compile('<div bp-tap="dummy()">A</div>')(scope)
    scope.$apply()
  }))

  describe('events', function() {
    it('should bind tap', function() {
      var events = $._data(element.get(0)).events
      expect(events.tap != null).toBe(true)
    })

    it('should execute associated expression', function() {
      spyOn(scope, 'dummy')
      element.trigger('tap')
      expect(scope.dummy).toHaveBeenCalled()
    })

    it('should unbind tap after destroy', function() {
      var events = $._data(element.get(0)).events
      scope.$destroy()
      expect(events.tap != null).toBe(false)
    })
  })
})
