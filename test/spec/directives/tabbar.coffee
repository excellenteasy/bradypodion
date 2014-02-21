describe 'tabbarDirective', ->

  element = null
  scope   = null
  state   = null

  beforeEach module 'bp'

  beforeEach module ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/first'
    $stateProvider
      .state 'first',
        url: '/first'
      .state 'second',
        url: '/second'
        data:
          title: 'Custom'
    null

  beforeEach inject ($rootScope, $compile, $state) ->
    scope = $rootScope.$new()
    state = $state
    template = "
    <bp-tabbar>
      <bp-tab bp-sref='first' bp-tab-icon='bp-icon-search'></bp-tab>
      <bp-tab bp-sref='second' bp-tab-icon='bp-icon-search'></bp-tab>
    </bp-tabbar>"
    element = $compile(template) scope
    scope.$apply()

  describe 'tabbar element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'tablist'

  describe 'tab elements', ->
    it 'should have correct name', ->
      expect(element.children().eq(0).text()).toBe 'First'
      expect(element.children().eq(1).text()).toBe 'Custom'

    it 'should have ARIA role', ->
      element.children().each (i,element) ->
        expect($(element).attr 'role' ).toBe 'tab'

    it 'should assign `bp-tab-active` class', inject ($timeout) ->
      $first  = element.find ':first-child'
      $second = element.find ':nth-child(2)'

      expect($first.hasClass 'bp-tab-active').toBe true
      expect($second.hasClass 'bp-tab-active').toBe false

      state.transitionTo 'second'
      $timeout.flush()

      expect($first.hasClass 'bp-tab-active').toBe false
      expect($second.hasClass 'bp-tab-active').toBe true

  describe 'events', ->
    it 'should bind touchstart', ->
      events = $._data(element.children().get(0)).events
      expect(events.touchstart?).toBe true

    it 'should change state 500ms after touchstart', inject ($timeout) ->
      element.children().eq(1).trigger 'touchstart'
      $timeout.flush()
      expect(state.$current.name).toBe 'second'

    it 'should unbind touchstart after destroy', ->
      events = $._data(element.children().get(0)).events
      scope.$destroy()
      expect(events.touchstart?).toBe false
