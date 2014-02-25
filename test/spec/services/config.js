describe('configProvider', function() {
  describe('default', function() {
    beforeEach(module('bp'))

    it('should have config', inject(function($rootScope, bpConfig) {
      var config = bpConfig
      var scope = $rootScope.$new()
      scope.$apply()
      expect(config.platform).toBe('ios')
    }))
  })
  describe('provider', function() {
    var object = {
      foo: 1
    }

    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        bar: 'foo',
        object: object
      })
    }))

    it('should be configurable', inject(function($rootScope, bpConfig) {
      var config, scope
      config = bpConfig
      scope = $rootScope.$new()
      scope.$apply()
      expect(config.bar).toBe('foo')
      expect(config.object).toBe(object)
    }))
  })

  describe('runtime', function() {
    beforeEach(module('bp'))

    it('should be configurable', inject(function($rootScope, bpConfig) {
      var config = bpConfig
      var scope = $rootScope.$new()
      scope.$apply()
      expect(config.platform).toBe('ios')
      config.setConfig({
        foo: 'bar'
      })
      expect(config.foo).toBe('bar')
    }))
  })
})
