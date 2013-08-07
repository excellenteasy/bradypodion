describe 'detailDisclosure', ->

  describe 'on ios and ios7', ->

    element = null
    parent  = null
    scope   = null

    beforeEach module 'bp'
    beforeEach inject ($rootScope, $compile) ->
      scope  = $rootScope.$new()
      parent = $compile('
        <div>
          <bp-detail-disclosure></bp-detail-disclosure>
        </div>') scope
      element = parent.children()
      scope.$apply()

    it 'should have ARIA attrs', ->
      expect(element.attr 'role').toBe 'button'
      expect(element.attr 'aria-label').toBe 'More Info'
      expect(element.attr 'aria-describedby').toBe parent.attr 'id'

  describe 'on android', ->

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
        <bp-detail-disclosure></bp-detail-disclosure>') scope
      scope.$apply()

    it 'shouldn\'t exist', ->
      expect(config.platform).toBe 'android'
      expect(element.attr 'aria-hidden').toBe 'true'
