describe('tabbarDirective', function() {
  var element, scope, state

  beforeEach(module('bp'))

  beforeEach(module(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/first')
    $stateProvider.state('first', {
      url: '/first'
    }).state('second', {
      url: '/second',
      data: {
        title: 'Custom'
      }
    })
  }))

  beforeEach(inject(function($rootScope, $compile, $state) {
    scope = $rootScope.$new()
    state = $state
    var template = '<bp-tabbar> <bp-tab ui-sref="first" bp-tab-icon="bp-icon-search"></bp-tab> <bp-tab ui-sref="second" bp-tab-icon="bp-icon-search"></bp-tab> </bp-tabbar>'
    element = $compile(template)(scope)
    scope.$apply()
  }))

  describe('tabbar element', function() {
    it('should have ARIA role', function() {
      expect(element.attr('role')).toBe('tablist')
    })
  })

  describe('tab elements', function() {
    it('should have correct name', function() {
      expect(element.children().eq(0).text()).toBe('First')
      expect(element.children().eq(1).text()).toBe('Custom')
    })

    it('should have ARIA role', function() {
      element.children().each(function(i, element) {
        expect($(element).attr('role')).toBe('tab')
      })
    })

    it('should assign `bp-tab-active` class', inject(function($timeout) {
      var $first = element.find(':first-child')
      var $second = element.find(':nth-child(2)')
      expect($first.hasClass('bp-tab-active')).toBe(true)
      expect($second.hasClass('bp-tab-active')).toBe(false)
      state.transitionTo('second')
      $timeout.flush()
      expect($first.hasClass('bp-tab-active')).toBe(false)
      expect($second.hasClass('bp-tab-active')).toBe(true)
    }))
  })

  describe('events', function() {
    it('should bind touchstart', function() {
      var events = $._data(element.children().get(0)).events
      expect(events.touchstart != null).toBe(true)
    })

    it('should change state 500ms after touchstart', inject(function($timeout) {
      element.children().eq(1).trigger('touchstart')
      $timeout.flush()
      expect(state.$current.name).toBe('second')
    }))

    it('should unbind touchstart after destroy', function() {
      var events = $._data(element.children().get(0)).events
      scope.$destroy()
      expect(events.touchstart != null).toBe(false)
    })
  })
})
