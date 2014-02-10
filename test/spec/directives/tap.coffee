describe 'tapDirective', ->

  beforeEach module 'bp'

  scope   = null
  element = null

  beforeEach inject ($rootScope, $compile) ->
    scope = $rootScope.$new()
    scope.dummy = ->
    element = $compile('<div bp-tap="dummy()">A</div>') scope
    scope.$apply()

  describe 'events', ->
    it 'should bind tap', ->
      events = $._data(element.get(0)).events
      expect(events.tap?).toBe true

    it 'should execute associated expression', ->
      spyOn scope, 'dummy'
      element.trigger 'tap'
      expect(scope.dummy).toHaveBeenCalled()

    it 'should unbind tap after destroy', ->
      events = $._data(element.get(0)).events
      scope.$destroy()
      expect(events.tap?).toBe false
