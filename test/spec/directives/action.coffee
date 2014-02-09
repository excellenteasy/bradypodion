describe 'actionDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile("
      <bp-action class='bp-button bp-action-up'>
        {{ label }}
      </bp-action>") scope
    scope.$apply()

  describe 'element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'button'

