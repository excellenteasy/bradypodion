describe('tapService', function() {
  var element, scope, tap;
  beforeEach(module('bp'));
  scope = null;
  element = null;
  tap = null;
  beforeEach(inject(function($rootScope, $compile, BpTap) {
    scope = $rootScope.$new();
    element = $compile('<div>A</div>')(scope);
    tap = new BpTap(scope, element);
    return scope.$apply();
  }));
  describe('events', function() {
    it('should bind', function() {
      var events;
      events = $._data(element.get(0)).events;
      expect(events.click != null).toBe(true);
      expect(events.touchstart != null).toBe(true);
      expect(events.touchmove != null).toBe(true);
      expect(events.touchend != null).toBe(true);
      return expect(events.touchcancel != null).toBe(true);
    });
    return it('should unbind after destroy', function() {
      var events;
      events = $._data(element.get(0)).events;
      scope.$destroy();
      expect(events.click != null).toBe(false);
      expect(events.touchstart != null).toBe(false);
      expect(events.touchmove != null).toBe(false);
      expect(events.touchend != null).toBe(false);
      return expect(events.touchcancel != null).toBe(false);
    });
  });
  describe('handlers', function() {
    it('should cancel click', function() {
      var e;
      e = $.Event('click');
      spyOn(e, 'preventDefault');
      spyOn(e, 'stopPropagation');
      spyOn(e, 'stopImmediatePropagation');
      tap.onClick(e);
      expect(e.preventDefault).toHaveBeenCalled();
      expect(e.stopPropagation).toHaveBeenCalled();
      return expect(e.stopImmediatePropagation).toHaveBeenCalled();
    });
    it('should handle touchstart', function() {
      var e;
      e = $.Event('touchstart', {
        pageX: 5,
        pageY: 5
      });
      element.trigger(e);
      expect(tap.touch).toEqual({
        x: 5,
        y: 5,
        ongoing: true
      });
      expect(element.hasClass('bp-active')).toBe(true);
      e = $.Event('touchstart', {
        pageX: 5,
        pageY: 5,
        target: angular.element('<div bp-tap>').eq(0)
      });
      element.trigger(e);
      return expect(tap.touch).toEqual({
        x: 5,
        y: 5,
        ongoing: true,
        nestedTap: true
      });
    });
    it('should handle touchmove', function() {
      var e, touch;
      touch = tap.touch;
      element.trigger($.Event('touchstart', {
        pageX: 5,
        pageY: 5
      }));
      element.trigger($.Event('touchmove', {
        pageX: 10,
        pageY: 10
      }));
      expect(touch.ongoing).toBe(true);
      expect(element.hasClass('bp-active')).toBe(true);
      element.trigger($.Event('touchmove', {
        pageX: 100,
        pageY: 100
      }));
      expect(touch.ongoing).toBe(false);
      expect(element.hasClass('bp-active')).toBe(false);
      e = $.Event('touchmove', {
        pageX: 10,
        pageY: 10
      });
      tap.options.noScroll = true;
      spyOn(e, 'preventDefault');
      element.trigger(e);
      expect(e.preventDefault).toHaveBeenCalled();
      expect(touch.ongoing).toBe(true);
      return expect(element.hasClass('bp-active')).toBe(true);
    });
    return it('should handle touchend', function() {
      var tapped;
      element.trigger($.Event('touchstart', {
        pageX: 5,
        pageY: 5
      }));
      tapped = false;
      element.on('tap', function() {
        return tapped = true;
      });
      element.trigger($.Event('touchend', {
        pageX: 10,
        pageY: 10
      }));
      expect(element.hasClass('bp-active')).toBe(false);
      expect(tap.touch).toEqual({});
      return expect(tapped).toBe(true);
    });
  });
  return describe('privates', function() {
    it('should return coordinate from event', function() {
      var e;
      expect(tap._getCoordinate({})).toBe(0);
      e = {
        originalEvent: {
          pageY: 1
        }
      };
      expect(tap._getCoordinate(e)).toBe(1);
      e = {
        originalEvent: {
          pageX: 2
        }
      };
      expect(tap._getCoordinate(e, true)).toBe(2);
      e = {
        pageY: 3
      };
      expect(tap._getCoordinate(e)).toBe(3);
      e = {
        changedTouches: [
          {
            pageY: 4
          }
        ]
      };
      return expect(tap._getCoordinate(e)).toBe(4);
    });
    return it('should determine options', inject(function(BpTap) {
      var element2, parents2, tap2;
      tap._setOptions();
      expect(tap.options).toEqual({
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 50,
        noScroll: false
      });
      tap._setOptions({}, {
        foo: true
      });
      expect(tap.options).toEqual({
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 50,
        noScroll: false,
        foo: true
      });
      tap._setOptions({
        bpAllowClick: true
      });
      expect(tap.options).toEqual({
        activeClass: 'bp-active',
        allowClick: true,
        boundMargin: 50,
        noScroll: false
      });
      parents2 = angular.element('<bp-navbar bp-iscroll> <bp-action></bp-action> </navbar>');
      element2 = parents2.find('bp-action');
      tap2 = new BpTap(scope, element2);
      tap2._setOptions();
      return expect(tap2.options).toEqual({
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 5,
        noScroll: true
      });
    }));
  });
});
