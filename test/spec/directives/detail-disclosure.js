describe('detailDisclosure', function() {
  describe('on android', function() {
    var config, element, scope

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'android'
      })
    }))

    beforeEach(inject(function($rootScope, $compile, bpApp) {
      config = bpApp
      scope = $rootScope.$new()
      element = $compile('<bp-detail-disclosure></bp-detail-disclosure>')(scope)
      scope.$apply()
    }))

    it('shouldn\'t exist', function() {
      expect(config.platform).toBe('android')
      expect(element.attr('aria-hidden')).toBe('true')
    })
  })
  describe('on ios and ios7', function() {
    var element, parent, scope

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'ios'
      })
    }))

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      parent = $compile('<div> <bp-detail-disclosure></bp-detail-disclosure> </div>')(scope)
      element = parent.children()
      scope.$apply()
    }))

    it('should have ARIA attrs', function() {
      expect(element.attr('role')).toBe('button')
      expect(element.attr('aria-label')).toBe('More Info')
      expect(element.attr('aria-describedby')).toBe(parent.attr('id'))
    })
  })
})
