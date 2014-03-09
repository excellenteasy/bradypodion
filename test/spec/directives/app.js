describe('appDirective', function() {
  var config, element, scope, ctrl

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile, bpApp) {
    config = bpApp
    scope = $rootScope.$new()
    element = $compile('<bp-app></bp-app>')(scope)
    ctrl = element.controller('bpApp')
    scope.$apply()
  }))

  describe('element', function() {
    it('should have default class ios', function() {
      expect(element.hasClass('ios')).toBe(true)
      expect(element.hasClass(config.platform)).toBe(true)
    })

    it('should have ARIA role', function() {
      expect(element.attr('role')).toBe('application')
    })
  })

  describe('onStateChangeStart', function() {
    it('should set transition', function() {
      ctrl.onStateChangeStart({}, {}, {
        direction: 'foo',
        transition: 'bar'
      })
      expect(ctrl.transition).toBe('bar-foo')
      ctrl.onStateChangeStart({}, {
        name: 'second',
        url: '/home/second'
      }, {}, {
        name: 'home',
        url: '/home',
        data: {
          transition: 'fade'
        }
      })
      expect(ctrl.transition).toBe('slide-normal')
    })
  })

  describe('onViewContentLoaded', function() {
    it('should add and remove classes', function() {
      var $views = angular.element('<div ui-view>')
      angular.element('body').append($views)
      scope.$apply()
      ctrl.transition = 'foo'
      ctrl.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(true)
      ctrl.transition = 'bar'
      ctrl.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(false)
      expect($views.hasClass('bar')).toBe(true)
      ctrl.transition = null
      ctrl.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(false)
      expect($views.hasClass('bar')).toBe(false)
    })
  })

  describe('setTransition', function() {
    it('should set transition', function() {
      ctrl.setTransition('foo', 'bar')
      expect(ctrl.transition).toBe('foo-bar')
      ctrl.setTransition(null, 'bar')
      expect(ctrl.transition).toBe(null)
      ctrl.setTransition('foo', null)
      expect(ctrl.transition).toBe(null)
    })
  })
})
