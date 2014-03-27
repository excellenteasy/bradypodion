describe('action overflow', function() {
  describe('android', function() {
    var element, scope, ctrl

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'android'
      })
    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      element = $compile('<bp-action-overflow> <bp-action ng-click class="fa-bookmark">First</bp-action> <bp-action ng-click class="fa-comment">Second</bp-action> </bp-action-overflow>')(scope)
      ctrl = element.controller('bpActionOverflow')
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
      it('should open on click', function() {
        spyOn(ctrl, 'open')
        element.trigger('click')
        expect(ctrl.open).toHaveBeenCalled()
        spyOn(ctrl, 'close')
        element.trigger('click')
        expect(ctrl.close).toHaveBeenCalled()
        element.trigger('click')
        expect(ctrl.open).toHaveBeenCalled()
      })

      it('should prevent close on actions', function() {
        var $menu = element.find('bp-action-overflow-menu')
        var $actions = $menu.children()
        spyOn(ctrl, 'close')
        $actions.trigger('touchstart')
        expect(ctrl.close).not.toHaveBeenCalled()
      })

      it('should close on window', inject(function($window) {
        spyOn(ctrl, 'open')
        element.trigger('click')
        expect(ctrl.open).toHaveBeenCalled()
        var $$window = angular.element($window)
        spyOn(ctrl, 'close')
        $$window.trigger('touchstart')
        expect(ctrl.close).toHaveBeenCalled()
      }))

      it('should unbind after destroy', inject(function($window) {
        var $menu = element.find('bp-action-overflow-menu')
        var $actions = $menu.children()
        var events = $._data(element.get(0)).events
        var actionEvents = $._data($actions.get(0)).events
        var windowEvents = $._data($window).events
        scope.$destroy()
        expect(events.click != null).toBe(false)
        expect(actionEvents.touchstart != null).toBe(false)
        expect(windowEvents.touchstart != null).toBe(false)
      }))
    })

    describe('controller', function() {
      it('should open menu', function() {
        var $menu = element.find('bp-action-overflow-menu')
        ctrl.open($menu)
        expect($menu.attr('aria-hidden')).toBe('false')
        expect($menu.hasClass('bp-action-overflow-open')).toBe(true)
      })

      it('should close menu', function() {
        var $menu = element.find('bp-action-overflow-menu')
        ctrl.close($menu)
        expect($menu.attr('aria-hidden')).toBe('true')
        expect($menu.hasClass('bp-action-overflow-open')).toBe(false)
      })
    })
  })
  describe('ios', function() {
    var config, element, scope

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'ios'
      })
    }))

    beforeEach(inject(function($rootScope, $compile, bpApp) {
      config = bpApp
      scope = $rootScope.$new()
      element = $compile('<bp-action-overflow></bp-action-overflow>')(scope)
      scope.$apply()
    }))

    it('should not exist', function() {
      expect(element.attr('aria-hidden')).toBe('true')
    })
  })
})
