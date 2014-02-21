describe('scrollDirective', function() {
  var element, events, scope;
  scope = null;
  element = null;
  events = null;
  beforeEach(module('bp'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    element = $compile('<div bp-scroll></div>')(scope);
    scope.$apply();
    return events = $._data(element.get(0)).events;
  }));
  return describe('events', function() {
    it('should bind touchstart', function() {
      return expect(events.touchstart != null).toBe(true);
    });
    return it('should unbind touchstart after destroy', function() {
      scope.$destroy();
      return expect(events.touchstart != null).toBe(false);
    });
  });
});
