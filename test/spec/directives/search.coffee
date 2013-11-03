describe 'searchDirective', ->

  beforeEach module 'bp'

  scope   = null
  element = null

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<bp-search><input type="search" /></bp-search>') scope
    scope.$apply()

  describe 'element', ->
    it 'should transclude the input field"', ->
      expect(element.has('input').length).toBe 1
    it 'should have a cancel button', ->
      expect(element.has('bp-button[bp-tap][bp-no-scroll]').length).toBe 1
      expect(element.find('bp-button').text()).toBe 'Cancel'
