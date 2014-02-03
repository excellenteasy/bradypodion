describe 'buttonDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile("
      <bp-action class='bp-button'>
        {{ label }}
      </bp-action>") scope
    scope.$apply()

  describe 'element', ->
    it 'should have correct label', ->
      scope.label = 'foo'
      scope.$apply()
      expect(element.text().trim()).toBe scope.label

      scope.label = 'bar'
      scope.$apply()
      expect(element.text().trim()).toBe scope.label

    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'button'
