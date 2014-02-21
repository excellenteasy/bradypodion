describe 'viewService', ->

  beforeEach module 'bp'

  beforeEach module ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/home'
    $stateProvider
      .state 'home',
        url: '/home'
        data:
          transition: 'fade'
      .state 'second',
        url: '/home/second'
        data:
          transition: 'slide'
      .state 'third',
        url: '/home/second/:third'
        data:
          transition: 'slide'
      .state 'fourth',
        url: '/home/foo/bar/fourth'
        data:
          transition: 'slide'
      .state 'fifth',
        url: '/home/baz/fifth'
        data:
          transition: 'slide'
      .state 'faroff',
        url: '/home/second/foo/bar/baz'
      .state 'alien',
        url: '/crazy/route'
      .state 'up',
        url: '/whatever'
        data: up: 'home'
    return

  viewService = null
  state = null
  scope = null

  home = second = third = fourth = fifth = alien = faroff = up =null


  beforeEach inject ($rootScope, bpView, $state) ->
    scope = $rootScope.$new()
    viewService = bpView
    state = $state
    home = state.get 'home'
    second = state.get 'second'
    third = state.get 'third'
    fourth = state.get 'fourth'
    fifth = state.get 'fifth'
    alien = state.get 'alien'
    faroff = state.get 'faroff'
    up = state.get 'up'


  describe 'listen', ->
    it 'should listen to events', ->
      spyOn viewService, 'onStateChangeStart'
      spyOn viewService, 'onViewContentLoaded'

      viewService.listen()

      scope.$emit '$stateChangeStart'
      scope.$emit '$viewContentLoaded'

      expect(viewService.onStateChangeStart).toHaveBeenCalled()
      expect(viewService.onViewContentLoaded).toHaveBeenCalled()

  describe 'onStateChangeStart', ->
    it 'should set transition', ->
      viewService.onStateChangeStart {}, {},
        direction: 'foo'
        transition: 'bar'
      expect(viewService.transition).toBe 'bar-foo'

      viewService.onStateChangeStart {}, second, {}, home
      expect(viewService.transition).toBe 'slide-normal'

  describe 'onViewContentLoaded', ->
    it 'should add and remove classes', ->
      $views = angular.element '<div ui-view>'
      angular.element('body').append $views
      scope.$apply()

      viewService.transition = 'foo'
      viewService.onViewContentLoaded()

      expect($views.hasClass 'foo').toBe true

      viewService.transition = 'bar'
      viewService.onViewContentLoaded()

      expect($views.hasClass 'foo').toBe false
      expect($views.hasClass 'bar').toBe true

      viewService.transition = null
      viewService.onViewContentLoaded()

      expect($views.hasClass 'foo').toBe false
      expect($views.hasClass 'bar').toBe false

  describe 'setTransition', ->
    it 'should set transition', ->
      viewService.setTransition 'foo', 'bar'
      expect(viewService.transition).toBe 'foo-bar'

      viewService.setTransition null, 'bar'
      expect(viewService.transition).toBe null

      viewService.setTransition 'foo', null
      expect(viewService.transition).toBe null

  describe 'getDirection', ->
    it 'should detect "normal"', ->
      expect(viewService.getDirection home, second).toBe 'normal'
      expect(viewService.getDirection second, third).toBe 'normal'
      expect(viewService.getDirection home, faroff).toBe 'normal'
      expect(viewService.getDirection home, up).toBe 'normal'

    it 'should detect "reverse"', ->
      expect(viewService.getDirection second, home).toBe 'reverse'
      expect(viewService.getDirection faroff, home).toBe 'reverse'
      expect(viewService.getDirection up, home).toBe 'reverse'

    it 'should detect no direction', ->
      expect(viewService.getDirection fourth, fifth).toBe null
      expect(viewService.getDirection third, fifth).toBe null
      expect(viewService.getDirection {url: '^'}).toBe null
      expect(viewService.getDirection alien, second).toBe null
      expect(viewService.getDirection alien, fifth).toBe null
      expect(viewService.getDirection third, fifth).toBe null
      expect(viewService.getDirection home, alien).toBe null

  describe 'getType', ->
    it 'should detect "normal" type', ->
      expect(viewService.getType home, second, 'normal').toBe 'slide'

    it 'should detect "reverse" type', ->
      expect(viewService.getType home, second, 'reverse').toBe 'fade'

    it 'should detect no type', ->
      expect(viewService.getType {}, {}, 'reverse').toBe null
      expect(viewService.getType {}, {}, 'normal').toBe null

  describe '_getURLSegments', ->
    it 'should return correct array', ->
      fn = viewService._getURLSegments
      expect(fn home)  .toEqual ['', 'home']
      expect(fn second).toEqual ['', 'home', 'second']
      expect(fn third) .toEqual ['', 'home', 'second', ':third']
      expect(fn {})    .toEqual ['']
