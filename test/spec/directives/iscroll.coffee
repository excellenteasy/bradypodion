describe 'iscrollDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope = $rootScope.$new()
    scope.$apply()
    element = $compile('
      <div bp-iscroll bp-iscroll-sticky>
        <ul class="inner"></ul>
      </div>') scope

  describe 'element', ->
    it 'should have immediate child `bp-iscroll-wrapper`', ->
      expect(element.children().is 'bp-iscroll-wrapper' ).toBe true

    it 'should have transcluded content', ->
      expect(element.children().children().is '.inner' ).toBe true

  describe 'directive', ->
    it 'should init and destroy iscroll', inject ($timeout) ->
      $timeout.flush()
      iscroll = scope.getIScroll()
      expect(iscroll instanceof IScroll).toBe true
      expect(scope.getIScrollSticky() instanceof IScrollSticky).toBe true
      spyOn iscroll, 'destroy'
      element.trigger '$destroy'
      expect(iscroll.destroy).toHaveBeenCalled()

  describe 'controller', ->
    it 'should set iscroll instance', ->
      foo = {}
      bar = {}
      scope.setIScroll foo, bar
      expect(scope.getIScroll()).toBe foo
      expect(scope.getIScrollSticky()).toBe bar
