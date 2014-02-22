describe('toolbar', function() {
  describe('android', function() {
    var config, element, scope

    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'android'
      })
    }))

    beforeEach(inject(function($rootScope, $compile, bpConfig) {
      config = bpConfig
      scope = $rootScope.$new()
      element = $compile('<bp-toolbar></bp-toolbar>')(scope)
      scope.$apply()
    }))

    it('should not exist', function() {
      expect(config.platform).toBe('android')
      expect(element.attr('aria-hidden')).toBe('true')
    })
  })
  describe('ios', function() {
    var element, scope

    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'ios'
      })
    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      element = $compile('<bp-toolbar> <bp-action bp-tap class="fa-bookmark">First</bp-action> <bp-action bp-tap class="fa-comment">Second</bp-action> </bp-toolbar>')(scope)
      scope.$apply()
    }))

    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('toolbar')
      })

      it('should have icons', function() {
        element.find('bp-action').each(function() {
          var $action = angular.element(this)
          expect($action.hasClass('bp-icon')).toBe(true)
          expect($action.hasClass('bp-button')).toBe(false)
          expect($action.attr('aria-label')).toMatch(/First|Second/)
        })
      })
    })
  })
})
