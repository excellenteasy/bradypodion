describe('searchDirective', function() {
  describe('android', function() {
    var $placeholder, $search, $tapLayer, children, element, scope

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'android'
      })

    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      element = $compile('<bp-search><input type="search"/></bp-search>')(scope)
      children = element.children()
      $search = children.eq(0)
      $placeholder = children.eq(1)
      $tapLayer = children.eq(2)
      scope.$apply()
    }))

    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('search')
      })

      it('should have child elements', function() {
        expect($search.is('input')).toBe(true)
        expect($placeholder.is('bp-search-placeholder')).toBe(true)
        expect($tapLayer.is('bp-search-tap')).toBe(true)
      })
    })
    describe('events', function() {
      it('should bind and unbind events', function() {
        var searchEvents = $._data($search.get(0)).events
        var tapLayerEvents = $._data($tapLayer.get(0)).events
        expect(searchEvents.blur != null).toBe(true)
        expect(tapLayerEvents.click != null).toBe(true)
        expect(tapLayerEvents.touchstart != null).toBe(true)
        expect(tapLayerEvents.touchmove != null).toBe(true)
        expect(tapLayerEvents.touchend != null).toBe(true)
        scope.$destroy()
        expect(searchEvents.blur != null).toBe(false)
        expect(tapLayerEvents.click != null).toBe(false)
        expect(tapLayerEvents.touchstart != null).toBe(false)
        expect(tapLayerEvents.touchmove != null).toBe(false)
        expect(tapLayerEvents.touchend != null).toBe(false)
      })

      it('should execute handlers correctly', inject(function($timeout) {
        var childScope = $placeholder.scope()
        childScope.onFocus()
        $timeout.flush()
        expect(element.hasClass('focus')).toBe(true)
        childScope.onBlur()
        expect(element.hasClass('focus')).toBe(false)
        var e = {
          stopPropagation: function() {},
          stopImmediatePropagation: function() {}
        }
        spyOn(e, 'stopPropagation')
        spyOn(e, 'stopImmediatePropagation')
        childScope.stopPropagation(e)
        expect(e.stopPropagation).toHaveBeenCalled()
        expect(e.stopImmediatePropagation).toHaveBeenCalled()
      }))
    })
  })
  describe('ios', function() {
    var $bgLeft, $bgRight, $cancel, $placeholder, $search, $tapLayer, children, element, scope

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'ios'
      })
    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      element = $compile('<bp-search><input type="search"/></bp-search>')(scope)
      children = element.children()
      $bgLeft = children.eq(0)
      $bgRight = children.eq(1)
      $search = children.eq(2)
      $placeholder = children.eq(3)
      $cancel = children.eq(4)
      $tapLayer = children.eq(5)
      scope.$apply()
    }))

    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('search')
      })

      it('should have child elements', function() {
        expect($bgLeft.is('bp-search-bg-left')).toBe(true)
        expect($bgRight.is('bp-search-bg-right')).toBe(true)
        expect($search.is('input')).toBe(true)
        expect($placeholder.is('bp-search-placeholder')).toBe(true)
        expect($cancel.is('bp-action')).toBe(true)
        expect($tapLayer.is('bp-search-tap')).toBe(true)

      })
      it('should calculate dimensions', inject(function($timeout) {
        $timeout.flush()
        expect($bgLeft.attr('style')).toMatch(/width/)
        expect($bgRight.attr('style')).toMatch(/width/)
        expect($search.attr('style')).toMatch(/width/)
        expect($search.attr('style')).toMatch(/padding-left/)
      }))
    })
    describe('events', function() {
      it('should bind and unbind events', inject(function($window) {
        var windowEvents = $._data($window).events
        var searchEvents = $._data($search.get(0)).events
        var tapLayerEvents = $._data($tapLayer.get(0)).events
        expect(windowEvents.resize != null).toBe(true)
        expect(windowEvents.orientationchange != null).toBe(true)
        expect(searchEvents.blur != null).toBe(true)
        expect(tapLayerEvents.click != null).toBe(true)
        expect(tapLayerEvents.touchstart != null).toBe(true)
        expect(tapLayerEvents.touchmove != null).toBe(true)
        expect(tapLayerEvents.touchend != null).toBe(true)
        scope.$destroy()
        expect(windowEvents.resize != null).toBe(false)
        expect(windowEvents.orientationchange != null).toBe(false)
        expect(searchEvents.blur != null).toBe(false)
        expect(tapLayerEvents.click != null).toBe(false)
        expect(tapLayerEvents.touchstart != null).toBe(false)
        expect(tapLayerEvents.touchmove != null).toBe(false)
        expect(tapLayerEvents.touchend != null).toBe(false)
      }))

      it('should execute handlers correctly', inject(function($timeout) {
        var childScope = $cancel.scope()
        $timeout.flush()
        $bgLeft.css('width', '')
        childScope.onResize()
        expect($bgLeft.attr('style')).toMatch(/width/)
        childScope.onFocus()
        $timeout.flush()
        expect(element.hasClass('focus')).toBe(true)
        childScope.onBlur()
        expect(element.hasClass('focus')).toBe(false)
        var e = {
          stopPropagation: function() {},
          stopImmediatePropagation: function() {}
        }
        spyOn(e, 'stopPropagation')
        spyOn(e, 'stopImmediatePropagation')
        childScope.stopPropagation(e)
        expect(e.stopPropagation).toHaveBeenCalled()
        expect(e.stopImmediatePropagation).toHaveBeenCalled()
      }))
    })
  })
})
