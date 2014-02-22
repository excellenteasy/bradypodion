describe('actionDirective', function() {
  var element, scope

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<bp-action class="bp-button bp-action-up"> {{ label }} </bp-action>')(scope)
    scope.$apply()
  }))

  describe('element', function() {
    it('should have ARIA role', function() {
      expect(element.attr('role')).toBe('button')
    })
  })
})
