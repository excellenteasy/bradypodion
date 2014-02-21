describe('iscrollDirective', function() {
  var element, scope;
  scope = null;
  element = null;
  beforeEach(module('bp'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.$apply();
    return element = $compile('<div bp-iscroll bp-iscroll-sticky> <ul class="inner"></ul> </div>')(scope);
  }));
  describe('element', function() {
    it('should have immediate child `bp-iscroll-wrapper`', function() {
      return expect(element.children().is('bp-iscroll-wrapper')).toBe(true);
    });
    return it('should have transcluded content', function() {
      return expect(element.children().children().is('.inner')).toBe(true);
    });
  });
  describe('directive', function() {
    return it('should init and destroy iscroll', inject(function($timeout) {
      var iscroll;
      $timeout.flush();
      iscroll = scope.getIScroll();
      expect(iscroll instanceof IScroll).toBe(true);
      expect(scope.getIScrollSticky() instanceof IScrollSticky).toBe(true);
      spyOn(iscroll, 'destroy');
      element.trigger('$destroy');
      return expect(iscroll.destroy).toHaveBeenCalled();
    }));
  });
  return describe('controller', function() {
    return it('should set iscroll instance', function() {
      var bar, foo;
      foo = {};
      bar = {};
      scope.setIScroll(foo, bar);
      expect(scope.getIScroll()).toBe(foo);
      return expect(scope.getIScrollSticky()).toBe(bar);
    });
  });
});
