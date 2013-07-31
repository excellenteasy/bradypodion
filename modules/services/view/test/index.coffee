describe 'viewService', ->

  beforeEach module 'ui.state'
  beforeEach module 'bp'

  beforeEach module ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/home'
    $stateProvider
      .state 'home',
        url: '/home'
        transition: 'fade'
      .state 'second',
        url: '/home/second'
        transition: 'slide'
    null

  viewService = null
  state = null

  beforeEach inject (bpViewService, $state) ->
    viewService = bpViewService
    state = $state

  describe 'getDirection', ->

    # using state names
    it 'should detect normal direction using state name strings', ->
      expect(viewService.getDirection 'home', 'second').toBe 'normal'

    it 'should detect reverse direction using state name strings', ->
      expect(viewService.getDirection 'second', 'home').toBe 'reverse'

    it 'should detect normal direction using state names in properties', ->
      expect(viewService.getDirection
        from: 'home'
        to: 'second'
      ).toBe 'normal'

    it 'should detect reverse direction using state name properties', ->
      expect(viewService.getDirection
        from: 'second'
        to: 'home'
      ).toBe 'reverse'

    it 'should detect none direction from "^" url', ->
      state.transitionTo 'home'
      expect(viewService.getDirection
        to: 'second'
      ).toBe 'none'


    # using urls
    it 'should detect normal direction using url strings', ->
      expect(viewService.getDirection '/home', '/home/second').toBe 'normal'

    it 'should detect reverse direction using url strings', ->
      expect(viewService.getDirection '/home/second', '/home').toBe 'reverse'

    it 'should detect normal direction using urls in properties', ->
      expect(viewService.getDirection
        from: '/home'
        to: '/home/second'
      ).toBe 'normal'

    it 'should detect reverse direction using urls in properties', ->
      expect(viewService.getDirection
        from: '/home/second'
        to: '/home'
      ).toBe 'reverse'

    it 'should detect none direction using "equal" URLs', ->
      expect(
        viewService.getDirection '/home/third', '/home/second'
      ).toBe 'none'

    it 'should detect none direction from "^" url', ->
      state.transitionTo 'home'
      expect(viewService.getDirection
        to: '/second'
      ).toBe 'none'

    it 'should not care about trailing slashes', ->
      expect(viewService.getDirection '/home/', '/home/second').toBe 'normal'
      expect(viewService.getDirection '/home', '/home/second/').toBe 'normal'
      expect(viewService.getDirection '/home/', '/home/second/').toBe 'normal'
