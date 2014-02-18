describe 'action overflow', ->

  describe 'android', ->

    element = null
    parent  = null
    scope   = null

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'android'
      null

    beforeEach inject ($rootScope, $compile) ->
      scope  = $rootScope.$new()
      element = $compile('
        <bp-action-overflow>
          <bp-action bp-tap class="fa-bookmark">First</bp-action>
          <bp-action bp-tap class="fa-comment">Second</bp-action>
        </bp-action-overflow>') scope
      scope.$apply()

    describe 'element', ->
      it 'should have ARIA role', ->
        expect(element.attr 'role').toBe 'button'
        expect(element.attr 'aria-has-popup').toBe 'true'

      it 'should have menu', ->
        $menu = element.find('bp-action-overflow-menu')
        expect($menu.length).toBe 1
        expect($menu.attr 'role').toBe 'menu'
        expect($menu.attr 'aria-hidden').toBe 'true'
        $actions = $menu.children()
        expect($actions.length).toBe 2

    describe 'events', ->
      it 'should open on tap', ->
        spyOn scope, 'open'
        element.trigger 'tap'
        expect(scope.open).toHaveBeenCalled()
        spyOn scope, 'close'
        element.trigger 'tap'
        expect(scope.close).toHaveBeenCalled()
        element.trigger 'tap'
        expect(scope.open).toHaveBeenCalled()

      it 'should prevent close on actions', ->
        $menu = element.find('bp-action-overflow-menu')
        $actions = $menu.children()
        spyOn scope, 'close'
        $actions.trigger 'touchstart'
        expect(scope.close).not.toHaveBeenCalled()

      it 'should close on window', inject ($window) ->
        spyOn scope, 'open'
        element.trigger 'tap'
        expect(scope.open).toHaveBeenCalled()
        $$window = angular.element $window
        spyOn scope, 'close'
        $$window.trigger 'touchstart'
        expect(scope.close).toHaveBeenCalled()

    describe 'controller', ->
      it 'should open menu', ->
        $menu = element.find('bp-action-overflow-menu')
        scope.open $menu
        expect($menu.attr 'aria-hidden').toBe 'false'
        expect($menu.hasClass 'bp-action-overflow-open').toBe true

      it 'should close menu', ->
        $menu = element.find('bp-action-overflow-menu')
        scope.close $menu
        expect($menu.attr 'aria-hidden').toBe 'true'
        expect($menu.hasClass 'bp-action-overflow-open').toBe false

  describe 'ios', ->

    config  = null
    element = null
    scope   = null

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'ios'
      null

    beforeEach inject ($rootScope, $compile, bpConfig) ->
      config  = bpConfig
      scope   = $rootScope.$new()
      element = $compile('
        <bp-action-overflow></bp-action-overflow>') scope
      scope.$apply()

    it "shouldn't exist", ->
      expect(element.attr 'aria-hidden').toBe 'true'
