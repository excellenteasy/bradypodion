describe('action overflow', function() {
  describe('android', function() {
    var element, parent, scope;
    element = null;
    parent = null;
    scope = null;
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'android'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<bp-action-overflow> <bp-action bp-tap class="fa-bookmark">First</bp-action> <bp-action bp-tap class="fa-comment">Second</bp-action> </bp-action-overflow>')(scope);
      return scope.$apply();
    }));
    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('button');
        return expect(element.attr('aria-has-popup')).toBe('true');
      });
      return it('should have menu', function() {
        var $actions, $menu;
        $menu = element.find('bp-action-overflow-menu');
        expect($menu.length).toBe(1);
        expect($menu.attr('role')).toBe('menu');
        expect($menu.attr('aria-hidden')).toBe('true');
        $actions = $menu.children();
        return expect($actions.length).toBe(2);
      });
    });
    describe('events', function() {
      it('should open on tap', function() {
        spyOn(scope, 'open');
        element.trigger('tap');
        expect(scope.open).toHaveBeenCalled();
        spyOn(scope, 'close');
        element.trigger('tap');
        expect(scope.close).toHaveBeenCalled();
        element.trigger('tap');
        return expect(scope.open).toHaveBeenCalled();
      });
      it('should prevent close on actions', function() {
        var $actions, $menu;
        $menu = element.find('bp-action-overflow-menu');
        $actions = $menu.children();
        spyOn(scope, 'close');
        $actions.trigger('touchstart');
        return expect(scope.close).not.toHaveBeenCalled();
      });
      it('should close on window', inject(function($window) {
        var $$window;
        spyOn(scope, 'open');
        element.trigger('tap');
        expect(scope.open).toHaveBeenCalled();
        $$window = angular.element($window);
        spyOn(scope, 'close');
        $$window.trigger('touchstart');
        return expect(scope.close).toHaveBeenCalled();
      }));
      return it('should unbind after destroy', inject(function($window) {
        var $actions, $menu, actionEvents, events, windowEvents;
        $menu = element.find('bp-action-overflow-menu');
        $actions = $menu.children();
        events = $._data(element.get(0)).events;
        actionEvents = $._data($actions.get(0)).events;
        windowEvents = $._data($window).events;
        scope.$destroy();
        expect(events.tap != null).toBe(false);
        expect(actionEvents.touchstart != null).toBe(false);
        return expect(windowEvents.touchstart != null).toBe(false);
      }));
    });
    return describe('controller', function() {
      it('should open menu', function() {
        var $menu;
        $menu = element.find('bp-action-overflow-menu');
        scope.open($menu);
        expect($menu.attr('aria-hidden')).toBe('false');
        return expect($menu.hasClass('bp-action-overflow-open')).toBe(true);
      });
      return it('should close menu', function() {
        var $menu;
        $menu = element.find('bp-action-overflow-menu');
        scope.close($menu);
        expect($menu.attr('aria-hidden')).toBe('true');
        return expect($menu.hasClass('bp-action-overflow-open')).toBe(false);
      });
    });
  });
  return describe('ios', function() {
    var config, element, scope;
    config = null;
    element = null;
    scope = null;
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'ios'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile, bpConfig) {
      config = bpConfig;
      scope = $rootScope.$new();
      element = $compile('<bp-action-overflow></bp-action-overflow>')(scope);
      return scope.$apply();
    }));
    return it("shouldn't exist", function() {
      return expect(element.attr('aria-hidden')).toBe('true');
    });
  });
});
