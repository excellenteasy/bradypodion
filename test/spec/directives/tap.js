describe('tapDirective', function() {
  var element, scope;
  beforeEach(module('bp'));
  scope = null;
  element = null;
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.dummy = function() {};
    element = $compile('<div bp-tap="dummy()">A</div>')(scope);
    return scope.$apply();
  }));
  return describe('events', function() {
    it('should bind tap', function() {
      var events;
      events = $._data(element.get(0)).events;
      return expect(events.tap != null).toBe(true);
    });
    it('should execute associated expression', function() {
      spyOn(scope, 'dummy');
      element.trigger('tap');
      return expect(scope.dummy).toHaveBeenCalled();
    });
    return it('should unbind tap after destroy', function() {
      var events;
      events = $._data(element.get(0)).events;
      scope.$destroy();
      return expect(events.tap != null).toBe(false);
    });
  });
});
