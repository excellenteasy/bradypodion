describe('appDirective', function() {
  var config, element, scope;
  config = null;
  scope = null;
  element = null;
  beforeEach(module('bp'));
  beforeEach(inject(function($rootScope, $compile, bpConfig) {
    config = bpConfig;
    scope = $rootScope.$new();
    element = $compile('<bp-app></bp-app>')(scope);
    return scope.$apply();
  }));
  return describe('element', function() {
    it('should have default class ios', function() {
      expect(element.hasClass('ios')).toBe(true);
      return expect(element.hasClass(config.platform)).toBe(true);
    });
    return it('should have ARIA role', function() {
      return expect(element.attr('role')).toBe('application');
    });
  });
});
