describe 'scrollDirective', ->

  scope   = null
  element = null
  events  = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<div bp-scroll></div>') scope
    scope.$apply()
    events  = $._data(element.get(0)).events

  describe 'events', ->
    it 'should bind touchstart', ->
      expect(events.touchstart?).toBe true

    it 'should unbind touchstart after destroy', ->
      scope.$destroy()
      expect(events.touchstart?).toBe false
