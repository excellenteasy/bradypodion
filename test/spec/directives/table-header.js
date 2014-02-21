describe('tableHeaderDirective', function() {
  var element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<bp-table-header>A</bp-table-header>')(scope)
    scope.$apply()
  }))

  describe('element', function() {
    it('should have the role "heading"', function() {
      expect(element.attr('role')).toBe('heading')
    })
  })
})
