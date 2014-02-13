describe 'srefDirective', ->

  element = null
  scope   = null
  state   = null

  beforeEach module 'bp'

  beforeEach module ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/first'
    $stateProvider
      .state 'first',
        url: '/first'
      .state 'second',
        url: '/second'
    null

  beforeEach inject ($rootScope, $compile, $state) ->
    scope = $rootScope.$new()
    state = $state
    element = $compile('<li bp-sref="second"></li>') scope
    scope.$apply()

  describe 'events', ->
    it 'should bind tap', ->
      events = $._data(element.get(0)).events
      expect(events.tap?).toBe true

    it 'should change state on tap', inject ($timeout) ->
      element.trigger 'tap'
      $timeout.flush()
      expect(state.$current.name).toBe 'second'

    it 'should unbind tap after destroy', ->
      events = $._data(element.get(0)).events
      scope.$destroy()
      expect(events.tap?).toBe false
