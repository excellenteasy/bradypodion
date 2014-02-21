describe('cellDirective', function() {
  var element, scope;
  scope = null;
  element = null;
  beforeEach(module('bp'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile('<bp-cell>Yo</bp-cell>')(scope);
    return scope.$apply();
  }));
  describe('element', function() {
    return it('should have ARIA role', function() {
      return expect(element.attr('role')).toBe('listitem');
    });
  });
  return describe('label', function() {
    return it('should be wrapped in span', function() {
      return expect(element.find('span').length).toBe(1);
    });
  });
});
