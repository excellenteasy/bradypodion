describe 'bodyDirective', ->

  config  = null
  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile, bpConfig) ->
    config  = bpConfig
    scope   = $rootScope.$new()
    element = $compile('<body></body>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have default class ios', ->
      expect(element.hasClass 'ios').toBe true
      expect(element.hasClass config.platform).toBe true

    it 'should reflect changed config', ->
      config.platform = 'ios7'
      scope.$apply()
      expect(element.hasClass 'ios7').toBe true
      expect(element.hasClass config.platform).toBe true

      config.platform = 'android'
      scope.$apply()
      expect(element.hasClass 'android').toBe true
      expect(element.hasClass config.platform).toBe true
