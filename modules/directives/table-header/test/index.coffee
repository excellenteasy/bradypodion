describe 'tableHeaderDirective', ->

  beforeEach module 'bp'

  scope   = null
  element = null

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<bp-table-header>A</bp-table-header>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have the role "heading"', ->
      expect(element.attr 'role').toBe 'heading'
