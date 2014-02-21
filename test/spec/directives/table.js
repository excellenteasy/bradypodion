describe('tableDirective', function() {
  var element, scope;
  beforeEach(module('bp'));
  scope = null;
  element = null;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile('<bp-table>Title</bp-table>')(scope);
    return scope.$apply();
  }));
  return describe('element', function() {
    return it('should have the role "list"', function() {
      return expect(element.attr('role')).toBe('list');
    });
  });
});
