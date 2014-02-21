describe('detailDisclosure', function() {
  describe('on android', function() {
    var config, element, scope;
    config = null;
    element = null;
    scope = null;
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'android'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile, bpConfig) {
      config = bpConfig;
      scope = $rootScope.$new();
      element = $compile('<bp-detail-disclosure></bp-detail-disclosure>')(scope);
      return scope.$apply();
    }));
    return it('shouldn\'t exist', function() {
      expect(config.platform).toBe('android');
      return expect(element.attr('aria-hidden')).toBe('true');
    });
  });
  return describe('on ios and ios7', function() {
    var element, parent, scope;
    element = null;
    parent = null;
    scope = null;
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'ios'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      parent = $compile('<div> <bp-detail-disclosure></bp-detail-disclosure> </div>')(scope);
      element = parent.children();
      return scope.$apply();
    }));
    return it('should have ARIA attrs', function() {
      expect(element.attr('role')).toBe('button');
      expect(element.attr('aria-label')).toBe('More Info');
      return expect(element.attr('aria-describedby')).toBe(parent.attr('id'));
    });
  });
});
