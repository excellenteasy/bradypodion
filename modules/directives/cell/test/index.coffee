describe 'cellDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<bp-cell>{{ label }}</bp-cell>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have correct label', ->
      scope.label = 'foo'
      scope.$apply()
      expect(element.text()).toBe scope.label

      scope.label = 'bar'
      scope.$apply()
      expect(element.text()).toBe scope.label

    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'listitem'
