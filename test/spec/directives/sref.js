describe('srefDirective', function() {
  var element, scope, state

  beforeEach(module('bp'))

  beforeEach(module(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/first')
    $stateProvider.state('first', {
      url: '/first'
    }).state('second', {
      url: '/second'
    })
  }))

  beforeEach(inject(function($rootScope, $compile, $state) {
    scope = $rootScope.$new()
    state = $state
    element = $compile('<li bp-sref="second"></li>')(scope)
    scope.$apply()
  }))

  describe('events', function() {
    it('should bind tap', function() {
      var events = $._data(element.get(0)).events
      expect(events.tap != null).toBe(true)
    })

    it('should change state on tap', inject(function($timeout) {
      element.trigger('tap')
      $timeout.flush()
      expect(state.$current.name).toBe('second')
    }))

    it('should unbind tap after destroy', function() {
      var events = $._data(element.get(0)).events
      scope.$destroy()
      expect(events.tap != null).toBe(false)
    })
  })
})
