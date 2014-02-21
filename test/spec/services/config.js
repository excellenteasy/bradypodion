describe('configProvider', function() {
  describe('default', function() {
    beforeEach(module('bp'));
    return it('should have config', inject(function($rootScope, bpConfig) {
      var config, scope;
      config = bpConfig;
      scope = $rootScope.$new();
      scope.$apply();
      return expect(config.platform).toBe('ios');
    }));
  });
  describe('provider', function() {
    var object;
    object = {
      foo: 1
    };
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        bar: 'foo',
        object: object
      });
    }));
    return it('should be configurable', inject(function($rootScope, bpConfig) {
      var config, scope;
      config = bpConfig;
      scope = $rootScope.$new();
      scope.$apply();
      expect(config.bar).toBe('foo');
      return expect(config.object).toBe(object);
    }));
  });
  return describe('runtime', function() {
    beforeEach(module('bp'));
    return it('should be configurable', inject(function($rootScope, bpConfig) {
      var config, scope;
      config = bpConfig;
      scope = $rootScope.$new();
      scope.$apply();
      expect(config.platform).toBe('ios');
      config.setConfig({
        foo: 'bar'
      });
      return expect(config.foo).toBe('bar');
    }));
  });
});
