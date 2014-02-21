describe('toolbar', function() {
  describe('android', function() {
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
      element = $compile('<bp-toolbar></bp-toolbar>')(scope);
      return scope.$apply();
    }));
    return it("shouldn't exist", function() {
      expect(config.platform).toBe('android');
      return expect(element.attr('aria-hidden')).toBe('true');
    });
  });
  return describe('ios', function() {
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
      element = $compile('<bp-toolbar> <bp-action bp-tap class="fa-bookmark">First</bp-action> <bp-action bp-tap class="fa-comment">Second</bp-action> </bp-toolbar>')(scope);
      return scope.$apply();
    }));
    return describe('element', function() {
      it('should have ARIA role', function() {
        return expect(element.attr('role')).toBe('toolbar');
      });
      return it('should have icons', function() {
        return element.find('bp-action').each(function() {
          var $action;
          $action = angular.element(this);
          expect($action.hasClass('bp-icon')).toBe(true);
          expect($action.hasClass('bp-button')).toBe(false);
          return expect($action.attr('aria-label')).toMatch(/First|Second/);
        });
      });
    });
  });
});
