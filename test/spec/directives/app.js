describe('appDirective', function() {
  var config, element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile, bpConfig) {
    config = bpConfig
    scope = $rootScope.$new()
    element = $compile('<bp-app></bp-app>')(scope)
    scope.$apply()
  }))

  describe('element', function() {
    it('should have default class ios', function() {
      expect(element.hasClass('ios')).toBe(true)
      expect(element.hasClass(config.platform)).toBe(true)
    })

    it('should have ARIA role', function() {
      expect(element.attr('role')).toBe('application')
    })
  })
})
