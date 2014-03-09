describe('appProvider', function() {
  describe('default', function() {
    beforeEach(module('bp'))

    it('should have config', inject(function($rootScope, bpApp) {
      var config = bpApp
      var scope = $rootScope.$new()
      scope.$apply()
      expect(config.platform).toBe('ios')
    }))
  })
  describe('provider', function() {
    var object = {
      foo: 1
    }

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        bar: 'foo',
        object: object
      })
    }))

    it('should be configurable', inject(function($rootScope, bpApp) {
      var config, scope
      config = bpApp
      scope = $rootScope.$new()
      scope.$apply()
      expect(config.bar).toBe('foo')
      expect(config.object).toBe(object)
    }))
  })
})

describe('app', function() {
  beforeEach(module('bp'))

  it('should be configurable', inject(function($rootScope, bpApp) {
    var config = bpApp
    var scope = $rootScope.$new()
    scope.$apply()
    expect(config.platform).toBe('ios')
    config.foo = 'bar'
    expect(config.foo).toBe('bar')
  }))

  it('should not share config', inject(function(bpApp) {
    expect(bpApp.foo).not.toBeDefined()
  }))
})
