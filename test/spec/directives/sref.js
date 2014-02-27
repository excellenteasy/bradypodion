describe('srefDirective', function() {
  var element, scope, state, ctrl

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
    ctrl = element.controller('bpSref')
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

  describe('controller', function() {
    it('should parse state name', function() {
      var ref = ctrl.parseStateRef('foo')
      expect(ref.state).toBe('foo')
      ref = ctrl.parseStateRef('bar({bar: 1})')
      expect(ref.state).toBe('bar')
    })

    it('should parse state params', function() {
      var ref = ctrl.parseStateRef('foo')
      expect(ref.params).toBe(null)
      ref = ctrl.parseStateRef('bar({bar: 1})')
      expect(ref.params).toEqual({bar: 1})
      scope.baz = {baz: 2}
      ref = ctrl.parseStateRef('bar(baz)')
      expect(ref.params).toEqual({baz: 2})
    })
  })
})
