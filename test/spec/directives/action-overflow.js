describe('action overflow', function() {
  describe('android', function() {
    var element, scope

    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'android'
      })
    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      element = $compile('<bp-action-overflow> <bp-action bp-tap class="fa-bookmark">First</bp-action> <bp-action bp-tap class="fa-comment">Second</bp-action> </bp-action-overflow>')(scope)
      scope.$apply()
    }))

    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('button')
        expect(element.attr('aria-has-popup')).toBe('true')
      })

      it('should have menu', function() {
        var $menu = element.find('bp-action-overflow-menu')
        expect($menu.length).toBe(1)
        expect($menu.attr('role')).toBe('menu')
        expect($menu.attr('aria-hidden')).toBe('true')
        var $actions = $menu.children()
        expect($actions.length).toBe(2)
      })
    })

    describe('events', function() {
      it('should open on tap', function() {
        spyOn(scope, 'open')
        element.trigger('tap')
        expect(scope.open).toHaveBeenCalled()
        spyOn(scope, 'close')
        element.trigger('tap')
        expect(scope.close).toHaveBeenCalled()
        element.trigger('tap')
        expect(scope.open).toHaveBeenCalled()
      })

      it('should prevent close on actions', function() {
        var $menu = element.find('bp-action-overflow-menu')
        var $actions = $menu.children()
        spyOn(scope, 'close')
        $actions.trigger('touchstart')
        expect(scope.close).not.toHaveBeenCalled()
      })

      it('should close on window', inject(function($window) {
        spyOn(scope, 'open')
        element.trigger('tap')
        expect(scope.open).toHaveBeenCalled()
        var $$window = angular.element($window)
        spyOn(scope, 'close')
        $$window.trigger('touchstart')
        expect(scope.close).toHaveBeenCalled()
      }))

      it('should unbind after destroy', inject(function($window) {
        var $menu = element.find('bp-action-overflow-menu')
        var $actions = $menu.children()
        var events = $._data(element.get(0)).events
        var actionEvents = $._data($actions.get(0)).events
        var windowEvents = $._data($window).events
        scope.$destroy()
        expect(events.tap != null).toBe(false)
        expect(actionEvents.touchstart != null).toBe(false)
        expect(windowEvents.touchstart != null).toBe(false)
      }))
    })

    describe('controller', function() {
      it('should open menu', function() {
        var $menu = element.find('bp-action-overflow-menu')
        scope.open($menu)
        expect($menu.attr('aria-hidden')).toBe('false')
        expect($menu.hasClass('bp-action-overflow-open')).toBe(true)
      })

      it('should close menu', function() {
        var $menu = element.find('bp-action-overflow-menu')
        scope.close($menu)
        expect($menu.attr('aria-hidden')).toBe('true')
        expect($menu.hasClass('bp-action-overflow-open')).toBe(false)
      })
    })
  })
  describe('ios', function() {
    var config, element, scope

    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'ios'
      })
    }))

    beforeEach(inject(function($rootScope, $compile, bpConfig) {
      config = bpConfig
      scope = $rootScope.$new()
      element = $compile('<bp-action-overflow></bp-action-overflow>')(scope)
      scope.$apply()
    }))

    it('should not exist', function() {
      expect(element.attr('aria-hidden')).toBe('true')
    })
  })
})
