describe 'toolbar', ->

  describe 'android', ->

    config  = null
    element = null
    scope   = null

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'android'
      null

    beforeEach inject ($rootScope, $compile, bpConfig) ->
      config  = bpConfig
      scope   = $rootScope.$new()
      element = $compile('
        <bp-toolbar></bp-toolbar>') scope
      scope.$apply()

    it "shouldn't exist", ->
      expect(config.platform).toBe 'android'
      expect(element.attr 'aria-hidden').toBe 'true'

  describe 'ios', ->

    element = null
    parent  = null
    scope   = null

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'ios'
      null

    beforeEach inject ($rootScope, $compile) ->
      scope  = $rootScope.$new()
      element = $compile('
        <bp-toolbar>
          <bp-action bp-tap class="fa-bookmark">First</bp-action>
          <bp-action bp-tap class="fa-comment">Second</bp-action>
        </bp-toolbar>') scope
      scope.$apply()

    describe 'element', ->
      it 'should have ARIA role', ->
        expect(element.attr 'role').toBe 'toolbar'

      it 'should have icons', ->
        element.find('bp-action').each ->
          $action = angular.element this
          expect($action.hasClass 'bp-icon').toBe true
          expect($action.hasClass 'bp-button').toBe false
          expect($action.attr 'aria-label').toMatch /First|Second/