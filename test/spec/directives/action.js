describe('actionDirective', function() {
  var element, scope;
  scope = null;
  element = null;
  beforeEach(module('bp'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile("<bp-action class='bp-button bp-action-up'> {{ label }} </bp-action>")(scope);
    return scope.$apply();
  }));
  return describe('element', function() {
    return it('should have ARIA role', function() {
      return expect(element.attr('role')).toBe('button');
    });
  });
});
