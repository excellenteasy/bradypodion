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

  describe 'getDirection', ->
    viewService = null
    state = null

    beforeEach inject (bpViewService, $state) ->
      viewService = bpViewService
      state = $state

    it 'should detect normal direction using state name strings', ->
      expect(viewService.getDirection 'home', 'second').toBe 'normal'

    it 'should detect reverse direction using state name strings', ->
      expect(viewService.getDirection 'second', 'home').toBe 'reverse'

    it 'should detct normal using state name properties', ->
      expect(viewService.getDirection
        from: 'home'
        to: 'second'
      ).toBe 'normal'

    it 'should detect reverse direction using state name properties', ->
      expect(viewService.getDirection
        from: 'second'
        to: 'home'
      ).toBe 'reverse'

    it 'should detect normal direction using only one state name property', ->
      expect(viewService.getDirection
        to: 'second'
      ).toBe 'normal'

    it 'should return state param direction', ->
      state.params.direction = 'reverse'
      expect(viewService.getDirection
        to: 'second'
        from: 'home'
      ).toBe 'reverse'
