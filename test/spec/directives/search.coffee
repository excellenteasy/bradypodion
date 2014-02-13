describe 'searchDirective', ->

  describe 'android', ->
    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'android'
      null

    scope   = null
    element = null
    children= null
    $search = $placeholder = $tapLayer = null

    beforeEach inject ($rootScope, $compile) ->
      scope   = $rootScope.$new()
      element = $compile('<bp-search><input type="search"/></bp-search>') scope
      children = element.children()
      $search = children.eq 0
      $placeholder = children.eq 1
      $tapLayer = children.eq 2
      scope.$apply()

    describe 'element', ->
      it 'should have ARIA role', ->
        expect(element.attr 'role').toBe 'search'

      it 'should have child elements', ->
        expect($search.is 'input').toBe true
        expect($placeholder.is 'bp-search-placeholder').toBe true
        expect($tapLayer.is 'bp-search-tap').toBe true

    describe 'events', ->
      it 'should bind and unbind events', inject ($window) ->
        searchEvents = $._data($search.get 0 ).events
        tapLayerEvents = $._data($tapLayer.get 0 ).events

        expect(searchEvents.blur?).toBe true
        expect(tapLayerEvents.tap?).toBe true
        expect(tapLayerEvents.click?).toBe true
        expect(tapLayerEvents.touchstart?).toBe true
        expect(tapLayerEvents.touchmove?).toBe true
        expect(tapLayerEvents.touchend?).toBe true

        scope.$destroy()

        expect(searchEvents.blur?).toBe false
        expect(tapLayerEvents.tap?).toBe false
        expect(tapLayerEvents.click?).toBe false
        expect(tapLayerEvents.touchstart?).toBe false
        expect(tapLayerEvents.touchmove?).toBe false
        expect(tapLayerEvents.touchend?).toBe false

      it 'should execute handlers correctly', inject ($timeout) ->
        childScope = $placeholder.scope()

        childScope.onFocus()
        $timeout.flush()
        expect(element.hasClass 'focus').toBe true

        childScope.onBlur()
        expect(element.hasClass 'focus').toBe false

        e =
          stopPropagation: ->
          stopImmediatePropagation: ->

        spyOn e, 'stopPropagation'
        spyOn e, 'stopImmediatePropagation'

        childScope.stopPropagation e

        expect(e.stopPropagation).toHaveBeenCalled()
        expect(e.stopImmediatePropagation).toHaveBeenCalled()

  describe 'ios', ->
    beforeEach module 'bp', (bpConfigProvider) ->
      bpConfigProvider.setConfig
        platform: 'ios'
      null

    scope   = null
    element = null
    children= null
    $bgLeft = $bgRight = $search = $placeholder = $cancel = $tapLayer = null

    beforeEach inject ($rootScope, $compile) ->
      scope   = $rootScope.$new()
      element = $compile('<bp-search><input type="search"/></bp-search>') scope
      children = element.children()
      $bgLeft = children.eq 0
      $bgRight = children.eq 1
      $search = children.eq 2
      $placeholder = children.eq 3
      $cancel = children.eq 4
      $tapLayer = children.eq 5
      scope.$apply()

    describe 'element', ->
      it 'should have ARIA role', ->
        expect(element.attr 'role').toBe 'search'

      it 'should have child elements', ->
        expect($bgLeft.is 'bp-search-bg-left').toBe true
        expect($bgRight.is 'bp-search-bg-right').toBe true
        expect($search.is 'input').toBe true
        expect($placeholder.is 'bp-search-placeholder').toBe true
        expect($cancel.is 'bp-action').toBe true
        expect($tapLayer.is 'bp-search-tap').toBe true

      it 'should calculate dimensions', inject ($timeout) ->
        $timeout.flush()
        expect($bgLeft.attr('style')).toMatch /width/
        expect($bgRight.attr('style')).toMatch /width/
        expect($search.attr('style')).toMatch /width/
        expect($search.attr('style')).toMatch /padding-left/

    describe 'events', ->
      it 'should bind and unbind events', inject ($window) ->
        windowEvents = $._data($window).events
        searchEvents = $._data($search.get 0 ).events
        cancelEvents = $._data($cancel.get 0 ).events
        tapLayerEvents = $._data($tapLayer.get 0 ).events

        expect(windowEvents.resize?).toBe true
        expect(windowEvents.orientationchange?).toBe true
        expect(searchEvents.blur?).toBe true
        expect(cancelEvents.tap?).toBe true
        expect(tapLayerEvents.tap?).toBe true
        expect(tapLayerEvents.click?).toBe true
        expect(tapLayerEvents.touchstart?).toBe true
        expect(tapLayerEvents.touchmove?).toBe true
        expect(tapLayerEvents.touchend?).toBe true

        scope.$destroy()

        expect(windowEvents.resize?).toBe false
        expect(windowEvents.orientationchange?).toBe false
        expect(searchEvents.blur?).toBe false
        expect(cancelEvents.tap?).toBe false
        expect(tapLayerEvents.tap?).toBe false
        expect(tapLayerEvents.click?).toBe false
        expect(tapLayerEvents.touchstart?).toBe false
        expect(tapLayerEvents.touchmove?).toBe false
        expect(tapLayerEvents.touchend?).toBe false

      it 'should execute handlers correctly', inject ($timeout) ->
        childScope = $cancel.scope()

        $bgLeft.css 'width', ''
        childScope.onResize()
        expect($bgLeft.attr 'style').toMatch /width/

        childScope.onFocus()
        $timeout.flush()
        expect(element.hasClass 'focus').toBe true

        childScope.onBlur()
        expect(element.hasClass 'focus').toBe false

        e =
          stopPropagation: ->
          stopImmediatePropagation: ->

        spyOn e, 'stopPropagation'
        spyOn e, 'stopImmediatePropagation'

        childScope.stopPropagation e

        expect(e.stopPropagation).toHaveBeenCalled()
        expect(e.stopImmediatePropagation).toHaveBeenCalled()

