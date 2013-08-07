describe 'configFactory', ->

  describe 'default', ->

    config = null
    scope  = null

    beforeEach module 'bp'

    beforeEach inject ($rootScope, bpConfig) ->
      config = bpConfig
      scope  = $rootScope.$new()
      scope.$apply()

    it 'should have default config', ->
      expect(config.platform).toBe 'ios'

  describe 'user', ->

    config = null
    scope  = null

    object = {foo:1}

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        property: 'random'
        object: object
      null

    beforeEach inject ($rootScope, bpConfig) ->
      config = bpConfig
      scope  = $rootScope.$new()
      scope.$apply()

    it 'should have user config', ->
      expect(config.property).toBe 'random'
      expect(config.object).toEqual object
