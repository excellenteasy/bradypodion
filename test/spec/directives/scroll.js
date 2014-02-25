describe('scrollDirective', function() {
  var element, events, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<div bp-scroll></div>')(scope)
    scope.$apply()
    events = $._data(element.get(0)).events
  }))

  describe('events', function() {
    it('should bind touchstart', function() {
      expect(events.touchstart != null).toBe(true)
    })

    it('should unbind touchstart after destroy', function() {
      scope.$destroy()
      expect(events.touchstart != null).toBe(false)
    })
  })
})
