describe 'appDirective', ->

  config  = null
  scope   = null
  element = null

  beforeEach module 'ui.router'
  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile, bpConfig) ->
    config  = bpConfig
    scope   = $rootScope.$new()
    element = $compile('<bp-app></bp-app>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have default class ios', ->
      expect(element.hasClass 'ios').toBe true
      expect(element.hasClass config.platform).toBe true

    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'application'
