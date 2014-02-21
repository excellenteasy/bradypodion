describe('cellDirective', function() {
  var element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<bp-cell>Yo</bp-cell>')(scope)
    scope.$apply()
  }))

  describe('element', function() {
    it('should have ARIA role', function() {
      expect(element.attr('role')).toBe('listitem')
    })
  })
  describe('label', function() {
    it('should be wrapped in span', function() {
      expect(element.find('span').length).toBe(1)
    })
  })
})
