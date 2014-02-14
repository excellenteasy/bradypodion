describe 'navbarDirective', ->
  describe 'ios', ->
    scope   = null
    state   = null
    timeout = null
    element = null
    title   = null

    beforeEach module 'bp'

    beforeEach module ($stateProvider, $urlRouterProvider) ->
      $urlRouterProvider.otherwise '/first'
      $stateProvider
        .state 'first',
          url: '/first'
          data:
            up: 'second'
        .state 'second',
          url: '/second'
      null

    beforeEach inject ($rootScope, $compile, $state, $timeout) ->
      scope = $rootScope.$new()
      state = $state
      timeout = $timeout
      state.transitionTo 'first'
      timeout.flush()
      element = $compile("
        <bp-navbar>
          <bp-action>Action</bp-action>
        </bp-navbar>") scope
      title = element.find 'bp-navbar-title'
      scope.$apply()


    describe 'controller', ->
      it 'getTitleFromState', inject ($controller) ->
        childScope = title.scope()
        stateTitle = childScope.getTitleFromState
          data: title: 'Foo'
        expect(stateTitle).toBe 'Foo'
        stateTitle = childScope.getTitleFromState
          name: 'Bar'
        expect(stateTitle).toBe 'Bar'
        stateTitle = childScope.getTitleFromState
          name: 'Buz'
          data: title: 'Baz'
        expect(stateTitle).toBe 'Baz'

    describe 'element', ->
      it 'should have ARIA role', ->
        expect(element.attr 'role').toBe 'navigation'
        expect(title.attr 'role').toBe 'heading'

      it 'should apply title', ->
        expect(title.text()).toBe 'First'

      it 'should place up button', ->
        $up = element.find '.bp-action-up'
        expect($up.text()).toBe 'Second'

      it 'should apply buttons', ->
        expect(element.find('bp-action').hasClass 'bp-button').toBe true
        expect(element.children().length).toBe 4

      it 'should calculate center', inject ($window) ->
        # We have to put the element into the DOM
        # otherwhise it won't have any width
        angular.element('body').append(element)
        timeout.flush()
        expect(element.children().length).toBe 5
        $spacer = element.find('div')
        expect($spacer.attr 'style').toMatch /width/
        expect($spacer.attr 'style').toMatch /flex/
        expect(element.children().get 2).toBe $spacer.get 0
        element.detach()

  describe 'android', ->
    scope   = null
    state   = null
    timeout = null
    element = null
    compile = null

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'android'
      null

    beforeEach module ($stateProvider, $urlRouterProvider) ->
      $urlRouterProvider.otherwise '/first'
      $stateProvider
        .state 'first',
          url: '/first'
          data:
            up: 'second'
        .state 'second',
          url: '/second'
      null

    beforeEach inject ($rootScope, $compile, $state, $timeout) ->
      compile = $compile
      scope = $rootScope.$new()
      state = $state
      timeout = $timeout
      state.transitionTo 'first'
      timeout.flush()
      element = $compile("
        <bp-navbar>
          <bp-action>Action</bp-action>
        </bp-navbar>") scope
      scope.$apply()

    describe 'element', ->
      it 'should apply icons', ->
        $icons = element.find '.bp-icon'
        expect($icons.length).toBe 2
        expect($icons.eq(1).attr 'aria-label').toBe 'Action'
        expect(element.find('.bp-action-up').length).toBe 1
        expect(element.children().length).toBe 3
        expect(element.find('bp-navbar-icon').length).toBe 1

      it 'should handle navbar icons', ->
        state.transitionTo 'second'
        timeout.flush()
        element2 = compile("
          <bp-navbar>
            <bp-action>Action</bp-action>
          </bp-navbar>") scope
        expect(element.children().length).toBe 3
        expect(element.find('bp-navbar-icon').length).toBe 1
