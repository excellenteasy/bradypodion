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
      it 'should getTitleFromState', ->
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

      it 'should convertActionToIcon', ->
        childScope = title.scope()
        $action = angular.element '<bp-action class="bp-button">Yo</bp-action>'
        childScope.convertActionToIcon $action
        expect($action.text()).toBe ''
        expect($action.hasClass 'bp-button').toBe false
        expect($action.hasClass 'bp-icon').toBe true
        expect($action.attr 'aria-label').toBe 'Yo'

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

      it 'should allow icons in navbar', inject ($compile) ->
        element2 = $compile("
          <bp-navbar bp-navbar-no-up bp-navbar-title>
            <bp-action class='bp-icon'>Action</bp-action>
          </bp-navbar>") scope
        $icon = element2.find('bp-action')
        expect($icon.hasClass 'bp-button').toBe false
        expect($icon.hasClass 'bp-icon').toBe true
        expect($icon.attr 'aria-label').toBe 'Action'

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
