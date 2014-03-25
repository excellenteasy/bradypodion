describe('tapService', function() {
  var element, scope, tap

  beforeEach(module('bp'))

  beforeEach(module(function(bpTapProvider) {
    bpTapProvider.setConfig({
      custom: true
    })
  }))

  beforeEach(inject(function($rootScope, $compile, bpTap) {
    scope = $rootScope.$new()
    element = $compile('<div>A</div>')(scope)
    tap = bpTap(element)
    scope.$apply()
  }))

  describe('events', function() {
    it('should bind', function() {
      var events = $._data(element.get(0)).events
      expect(events.click != null).toBe(true)
      expect(events.touchstart != null).toBe(true)
      expect(events.touchmove != null).toBe(true)
      expect(events.touchend != null).toBe(true)
      expect(events.touchcancel != null).toBe(true)
    })

    it('should unbind', function() {
      var events = $._data(element.get(0)).events
      tap.disable()
      expect(events.click != null).toBe(false)
      expect(events.touchstart != null).toBe(false)
      expect(events.touchmove != null).toBe(false)
      expect(events.touchend != null).toBe(false)
      expect(events.touchcancel != null).toBe(false)
    })
  })

  describe('handlers', function() {
    it('should cancel click', function() {
      var e = $.Event('click')
      spyOn(e, 'preventDefault')
      spyOn(e, 'stopPropagation')
      spyOn(e, 'stopImmediatePropagation')
      tap.onClick(e)
      expect(e.preventDefault).toHaveBeenCalled()
      expect(e.stopPropagation).toHaveBeenCalled()
      expect(e.stopImmediatePropagation).toHaveBeenCalled()
    })

    it('should handle touchstart', function() {
      var e = $.Event('touchstart', {
        pageX: 5,
        pageY: 5
      })
      element.trigger(e)
      expect(tap.touch).toEqual({
        x: 5,
        y: 5,
        ongoing: true
      })
      expect(element.hasClass('bp-active')).toBe(true)
      e = $.Event('touchstart', {
        pageX: 5,
        pageY: 5,
        target: angular.element('<div ng-click>').eq(0)
      })
      element.trigger(e)
      expect(tap.touch).toEqual({
        x: 5,
        y: 5,
        ongoing: true,
        nestedTap: true
      })
    })

    it('should handle touchmove', function() {
      var touch = tap.touch
      element.trigger($.Event('touchstart', {
        pageX: 5,
        pageY: 5
      }))
      element.trigger($.Event('touchmove', {
        pageX: 10,
        pageY: 10
      }))
      expect(touch.ongoing).toBe(true)
      expect(element.hasClass('bp-active')).toBe(true)
      element.trigger($.Event('touchmove', {
        pageX: 100,
        pageY: 100
      }))
      expect(touch.ongoing).toBe(false)
      expect(element.hasClass('bp-active')).toBe(false)
      var e = $.Event('touchmove', {
        pageX: 10,
        pageY: 10
      })
      tap.options.noScroll = true
      spyOn(e, 'preventDefault')
      element.trigger(e)
      expect(e.preventDefault).toHaveBeenCalled()
      expect(touch.ongoing).toBe(true)
      expect(element.hasClass('bp-active')).toBe(true)
    })

    it('should handle touchend', function() {
      element.trigger($.Event('touchstart', {
        pageX: 5,
        pageY: 5
      }))
      var tapped = false
      element.on('tap', function() {
        tapped = true
      })
      element.trigger($.Event('touchend', {
        pageX: 10,
        pageY: 10
      }))
      expect(element.hasClass('bp-active')).toBe(false)
      expect(tap.touch).toEqual({})
      expect(tapped).toBe(true)
    })
  })

  describe('privates', function() {
    it('should get coordinate from event', function() {
      expect(tap._getCoordinate({})).toBe(0)
      var e = {
        originalEvent: {
          pageY: 1
        }
      }
      expect(tap._getCoordinate(e)).toBe(1)
      e = {
        originalEvent: {
          pageX: 2
        }
      }
      expect(tap._getCoordinate(e, true)).toBe(2)
      e = {
        pageY: 3
      }
      expect(tap._getCoordinate(e)).toBe(3)
      e = {
        changedTouches: [
          {
            pageY: 4
          }
        ]
      }
      expect(tap._getCoordinate(e)).toBe(4)
    })

    it('should determine options', inject(function(bpTap) {
      expect(tap.options).toEqual({
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 50,
        noScroll: false,
        custom: true
      })

      tap._setConfig({
        bpAllowClick: true
      })

      expect(tap.options).toEqual({
        activeClass: 'bp-active',
        allowClick: true,
        boundMargin: 50,
        noScroll: false,
        custom: true
      })

      var parents2 = angular.element('<bp-navbar bp-iscroll> <bp-action></bp-action> </bp-navbar>')
      var element2 = parents2.find('bp-action')
      var tap2 = bpTap(element2)

      expect(tap2.options).toEqual({
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 5,
        noScroll: true,
        custom: true
      })
    }))
  })
})
