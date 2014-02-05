describe 'viewService', ->

  beforeEach module 'ui.router'
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
      ).toBe ''

    it 'should detect reverse direction using state objects', ->
      expect(viewService.getDirection
        name: 'second'
        url: '/home/second'
      ,
        url: '/home'
        name: 'home'
      ).toBe('reverse')

    it 'should detect normal direction using state objects without urls', ->
      expect(viewService.getDirection
        name: 'second'
      ,
        name: 'home'
      ).toBe('reverse')


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
      ).toBe ''

    it 'should detect none direction from "^" url', ->
      state.transitionTo 'home'
      expect(viewService.getDirection
        to: '/second'
      ).toBe ''

    it 'should not care about trailing slashes', ->
      expect(viewService.getDirection '/home/', '/home/second').toBe 'normal'
      expect(viewService.getDirection '/home', '/home/second/').toBe 'normal'
      expect(viewService.getDirection '/home/', '/home/second/').toBe 'normal'

    # back button detection edge case
    it 'should detect reverse direction in paramzartized URLs (1)', ->
      expect(viewService.getDirection
        from: 'third'
        to: 'second'
      ).toBe 'reverse'

    it 'should detect reverse direction in paramzartized URLs (2)', ->
      expect(viewService.getDirection
        from: '/home/second/:third'
        to: 'second'
      ).toBe 'reverse'

    # jumping levels
    it 'should detect reverse directions when jumping back to /home', ->
      expect(viewService.getDirection
        from: '/home/second/:third'
        to: '/home'
      ).toBe 'reverse'

    it 'should detect reverse directions when jumping back to state home', ->
      expect(viewService.getDirection
        from: 'third'
        to: 'home'
      ).toBe 'reverse'

    it 'should detect normal directions when jumping from home to third', ->
      expect(viewService.getDirection
        from: 'home'
        to: 'third'
      ).toBe 'normal'

    it 'should detect normal directions when jumping from /home to third', ->
      expect(viewService.getDirection
        from: '/home'
        to: '/home/second/:third'
      ).toBe 'normal'
