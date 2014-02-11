describe 'configProvider', ->

  describe 'default', ->
    beforeEach module 'bp'

    it 'should have config', inject ($rootScope, bpConfig) ->
      config = bpConfig
      scope  = $rootScope.$new()
      scope.$apply()

      expect(config.platform).toBe 'ios'

  describe 'provider', ->

    object = {foo:1}

    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        bar: 'foo'
        object: object
      return

    it 'should be configurable', inject ($rootScope, bpConfig) ->
      config = bpConfig
      scope  = $rootScope.$new()
      scope.$apply()

      expect(config.bar).toBe 'foo'
      expect(config.object).toBe object

  describe 'runtime', ->
    beforeEach module 'bp'

    it 'should be configurable', inject ($rootScope, bpConfig) ->
      config = bpConfig
      scope  = $rootScope.$new()
      scope.$apply()

      expect(config.platform).toBe 'ios'

      config.setConfig
        foo: 'bar'

      expect(config.foo).toBe 'bar'
