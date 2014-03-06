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

  describe('parseState', function() {
    it('should parse state name', function() {
      var ref = viewService.parseState('foo', scope)
      expect(ref.state).toBe('foo')
      ref = viewService.parseState('bar({bar: 1})', scope)
      expect(ref.state).toBe('bar')
    })

    it('should parse state params', function() {
      var ref = viewService.parseState('foo', scope)
      expect(ref.params).toBe(null)
      ref = viewService.parseState('bar({bar: 1})', scope)
      expect(ref.params).toEqual({bar: 1})
      scope.baz = {baz: 2}
      ref = viewService.parseState('bar(baz)', scope)
      expect(ref.params).toEqual({baz: 2})
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
