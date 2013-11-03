describe 'iscrollDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope = $rootScope.$new()
    scope.$apply()
    element = $compile('<div bp-iscroll><ul class="inner"></ul></div>') scope

  describe 'element', ->
    it 'should have immediate child `bp-iscroll-wrapper`', ->
      expect(element.children().is 'bp-iscroll-wrapper' ).toBe true

    it 'should have transcluded content', ->
      expect(element.children().children().is '.inner' ).toBe true
