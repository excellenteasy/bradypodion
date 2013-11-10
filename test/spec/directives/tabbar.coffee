describe 'tabbarDirective', ->

  element = null
  scope   = null
  state   = null

  beforeEach module 'ui.router'

  beforeEach module 'bp'

  beforeEach module ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/first'
    $stateProvider
      .state 'first',
        url: '/first'
      .state 'second',
        url: '/second'
    null

  beforeEach inject ($rootScope, $compile, $state) ->
    scope = $rootScope.$new()
    state = $state
    template = '''
    <bp-tabbar>
      <bp-tab class="bp-icon-search" bp-tap='to(tabState)' bp-state="first">
        First
      </bp-tab>
      <bp-tab class="bp-icon-search" bp-tap='to(tabState)' bp-state="second">
        Second
      </bp-tab>
    </bp-tabbar>'''
    element = $compile(template) scope
    scope.$apply()

  describe 'tabbar element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'tablist'

  describe 'tab elements', ->
    it 'should have ARIA role', ->
      element.children().each (i,element) ->
        expect($(element).attr 'role' ).toBe 'tab'

    it 'should have `bp-tab-active` class', ->
      $first  = element.find ':first-child'
      $second = element.find ':nth-child(2)'

      expect($first.hasClass 'bp-tab-active').toBe true
      expect($second.hasClass 'bp-tab-active').toBe false

      # done = no
      # runs ->
      #   scope.$on '$stateChangeError', ->
      #     done = yes
      #   state.transitionTo 'second'

      # waitsFor (-> done), 1000

      # runs ->
      #   expect($first.hasClass 'bp-tab-active').toBe false
      #   expect($second.hasClass 'bp-tab-active').toBe true
