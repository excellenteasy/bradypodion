describe 'cellDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<bp-cell>Yo</bp-cell>') scope
    scope.$apply()

  describe 'element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'listitem'

  describe 'label', ->
    it 'should be wrapped in span', ->
      expect(element.find('span').length).toBe 1

