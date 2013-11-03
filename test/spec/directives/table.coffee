describe 'tableDirective', ->

  beforeEach module 'bp'

  scope   = null
  element = null

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<bp-table>Title</bp-table>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have the role "list"', ->
      expect(element.attr 'role').toBe 'list'
