describe('viewService', function() {
  var alien, faroff, fifth, fourth, home, scope, second, state, third, up, viewService

  beforeEach(module('bp'))

  beforeEach(module(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home')
    $stateProvider.state('home', {
      url: '/home',
      data: {
        transition: 'fade'
      }
    }).state('second', {
      url: '/home/second'
    }).state('third', {
      url: '/home/second/:third'
    }).state('fourth', {
      url: '/home/foo/bar/fourth'
    }).state('fifth', {
      url: '/home/baz/fifth'
    }).state('faroff', {
      url: '/home/second/foo/bar/baz'
    }).state('alien', {
      url: '/crazy/route'
    }).state('up', {
      url: '/whatever',
      data: {
        up: 'home'
      }
    })
  }))

  beforeEach(inject(function($rootScope, bpView, $state) {
    scope = $rootScope.$new()
    viewService = bpView
    state = $state
    home = state.get('home')
    second = state.get('second')
    third = state.get('third')
    fourth = state.get('fourth')
    fifth = state.get('fifth')
    alien = state.get('alien')
    faroff = state.get('faroff')
    up = state.get('up')
  }))

  describe('listen', function() {
    it('should listen to events', function() {
      spyOn(viewService, 'onStateChangeStart')
      spyOn(viewService, 'onViewContentLoaded')
      viewService.listen()
      scope.$emit('$stateChangeStart')
      scope.$emit('$viewContentLoaded')
      expect(viewService.onStateChangeStart).toHaveBeenCalled()
      expect(viewService.onViewContentLoaded).toHaveBeenCalled()
    })
  })

  describe('onStateChangeStart', function() {
    it('should set transition', function() {
      viewService.onStateChangeStart({}, {}, {
        direction: 'foo',
        transition: 'bar'
      })
      expect(viewService.transition).toBe('bar-foo')
      viewService.onStateChangeStart({}, second, {}, home)
      expect(viewService.transition).toBe('slide-normal')
    })
  })

  describe('onViewContentLoaded', function() {
    it('should add and remove classes', function() {
      var $views = angular.element('<div ui-view>')
      angular.element('body').append($views)
      scope.$apply()
      viewService.transition = 'foo'
      viewService.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(true)
      viewService.transition = 'bar'
      viewService.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(false)
      expect($views.hasClass('bar')).toBe(true)
      viewService.transition = null
      viewService.onViewContentLoaded()
      expect($views.hasClass('foo')).toBe(false)
      expect($views.hasClass('bar')).toBe(false)
    })
  })

  describe('setTransition', function() {
    it('should set transition', function() {
      viewService.setTransition('foo', 'bar')
      expect(viewService.transition).toBe('foo-bar')
      viewService.setTransition(null, 'bar')
      expect(viewService.transition).toBe(null)
      viewService.setTransition('foo', null)
      expect(viewService.transition).toBe(null)
    })
  })

  describe('getDirection', function() {
    it('should detect "normal"', function() {
      expect(viewService.getDirection(home, second)).toBe('normal')
      expect(viewService.getDirection(second, third)).toBe('normal')
      expect(viewService.getDirection(home, faroff)).toBe('normal')
      expect(viewService.getDirection(home, up)).toBe('normal')
    })

    it('should detect "reverse"', function() {
      expect(viewService.getDirection(second, home)).toBe('reverse')
      expect(viewService.getDirection(faroff, home)).toBe('reverse')
      expect(viewService.getDirection(up, home)).toBe('reverse')
    })

    it('should detect no direction', function() {
      expect(viewService.getDirection(fourth, fifth)).toBe(null)
      expect(viewService.getDirection(third, fifth)).toBe(null)
      expect(viewService.getDirection({
        url: '^'
      })).toBe(null)
      expect(viewService.getDirection(alien, second)).toBe(null)
      expect(viewService.getDirection(alien, fifth)).toBe(null)
      expect(viewService.getDirection(third, fifth)).toBe(null)
      expect(viewService.getDirection(home, alien)).toBe(null)
    })
  })

  describe('getType', function() {
    it('should detect "normal" type', function() {
      expect(viewService.getType(home, second, 'normal')).toBe('slide')
    })

    it('should detect "reverse" type', function() {
      expect(viewService.getType(home, second, 'reverse')).toBe('fade')
    })

    it('should read type from different configs', function() {
      expect(viewService.getType({}, {}, 'normal')).toBe('slide')
      expect(viewService.getType({
        data: {
          transition: 'scale'
        }
      }, {}, 'reverse')).toBe('scale')
      expect(viewService.getType({
        data: {
          modal: true
        }
      }, {}, 'reverse')).toBe('cover')
    })
  })

  describe('_getURLSegments', function() {
    it('should correct array', function() {
      var fn = viewService._getURLSegments
      expect(fn(home)).toEqual(['', 'home'])
      expect(fn(second)).toEqual(['', 'home', 'second'])
      expect(fn(third)).toEqual(['', 'home', 'second', ':third'])
      expect(fn({})).toEqual([''])
    })
  })
})
