describe 'tapService', ->

  beforeEach module 'bp'

  scope   = null
  element = null
  tap     = null

  beforeEach inject ($rootScope, $compile, Tap) ->
    scope   = $rootScope.$new()
    element = $compile('<div>A</div>') scope
    tap     = new Tap scope, element
    scope.$apply()

  describe 'events', ->
    it 'should bind', ->
      events = $._data(element.get(0)).events
      expect(events.click?).toBe true
      expect(events.touchstart?).toBe true
      expect(events.touchmove?).toBe true
      expect(events.touchend?).toBe true
      expect(events.touchcancel?).toBe true

    it 'should unbind after destroy', ->
      events = $._data(element.get(0)).events
      scope.$destroy()
      expect(events.click?).toBe false
      expect(events.touchstart?).toBe false
      expect(events.touchmove?).toBe false
      expect(events.touchend?).toBe false
      expect(events.touchcancel?).toBe false

  describe 'handlers', ->
    it 'should cancel click', ->
      e = $.Event 'click'

      spyOn e, 'preventDefault'
      spyOn e, 'stopPropagation'
      spyOn e, 'stopImmediatePropagation'

      tap.onClick e

      expect(e.preventDefault).toHaveBeenCalled()
      expect(e.stopPropagation).toHaveBeenCalled()
      expect(e.stopImmediatePropagation).toHaveBeenCalled()

    it 'should handle touchstart', ->
      e = $.Event 'touchstart',
        pageX: 5
        pageY: 5

      element.trigger e

      expect(tap._getTouch()).toEqual
        x: 5
        y: 5
        ongoing: yes

      expect(element.hasClass 'bp-active').toBe true

      e = $.Event 'touchstart',
        pageX: 5
        pageY: 5
        target: angular.element('<div bp-tap>').eq 0

      element.trigger e

      expect(tap._getTouch()).toEqual
        x: 5
        y: 5
        ongoing: yes
        nestedTap: yes

    it 'should handle touchmove', ->
      touch = tap._getTouch()

      element.trigger $.Event 'touchstart',
        pageX: 5
        pageY: 5

      element.trigger $.Event 'touchmove',
       pageX: 10
       pageY: 10

      expect(touch.ongoing).toBe true
      expect(element.hasClass 'bp-active').toBe true

      element.trigger $.Event 'touchmove',
       pageX: 100
       pageY: 100

      expect(touch.ongoing).toBe false
      expect(element.hasClass 'bp-active').toBe false

      e = $.Event 'touchmove',
       pageX: 10
       pageY: 10

      tap.options.noScroll = true
      spyOn e, 'preventDefault'

      element.trigger e

      expect(e.preventDefault).toHaveBeenCalled()
      expect(touch.ongoing).toBe true
      expect(element.hasClass 'bp-active').toBe true

    it 'should handle touchend', ->
      element.trigger $.Event 'touchstart',
        pageX: 5
        pageY: 5

      tapped = false
      element.on 'tap', ->
        tapped = true

      element.trigger $.Event 'touchend',
       pageX: 10
       pageY: 10

      expect(element.hasClass 'bp-active').toBe false
      expect(tap._getTouch()).toEqual {}
      expect(tapped).toBe true

  describe 'privates', ->
    it 'should return coordinate from event', ->
      expect(tap._getCoordinate({})).toBe 0

      e = originalEvent:
        pageY: 1
      expect(tap._getCoordinate(e)).toBe 1

      e = originalEvent:
        pageX: 2
      expect(tap._getCoordinate(e,yes)).toBe 2

      e = pageY: 3
      expect(tap._getCoordinate(e)).toBe 3

      e = changedTouches: [pageY: 4]
      expect(tap._getCoordinate(e)).toBe 4

    it 'should determine options', inject (Tap) ->

      tap._setOptions()

      expect(tap.options).toEqual
        activeClass: 'bp-active'
        allowClick: no
        boundMargin: 50
        noScroll: no

      tap._setOptions({},{foo:yes})

      expect(tap.options).toEqual
        activeClass: 'bp-active'
        allowClick: no
        boundMargin: 50
        noScroll: no
        foo: yes

      tap._setOptions({bpAllowClick:yes})

      expect(tap.options).toEqual
        activeClass: 'bp-active'
        allowClick: yes
        boundMargin: 50
        noScroll: no

      parents2 = angular.element '
        <bp-navbar bp-iscroll>
          <bp-action></bp-action>
        </navbar>'

      element2 = parents2.find 'bp-action'

      tap2 = new Tap scope, element2

      tap2._setOptions()

      expect(tap2.options).toEqual
        activeClass: 'bp-active'
        allowClick: no
        boundMargin: 5
        noScroll: yes
