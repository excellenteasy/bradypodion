describe('tableHeaderDirective', function() {
  var element, scope;
  beforeEach(module('bp'));
  scope = null;
  element = null;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile('<bp-table-header>A</bp-table-header>')(scope);
    return scope.$apply();
  }));
  return describe('element', function() {
    return it('should have the role "heading"', function() {
      return expect(element.attr('role')).toBe('heading');
    });
  });
});
