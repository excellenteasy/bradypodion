describe('tableDirective', function() {
  var element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<bp-table>Title</bp-table>')(scope)
    scope.$apply()
  }))

  describe('element', function() {
    it('should have the role "list"', function() {
      expect(element.attr('role')).toBe('list')
    })
  })
})
