describe('iscrollDirective', function() {
  var element, scope

  beforeEach(module('bp'))
  beforeEach(module('bp.iscroll'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    scope.$apply()
    element = $compile('<div bp-iscroll bp-iscroll-sticky> <ul class="inner"></ul> </div>')(scope)
  }))

  describe('element', function() {
    it('should have immediate child `bp-iscroll-wrapper`', function() {
      expect(element.children().is('bp-iscroll-wrapper')).toBe(true)
    })
    it('should have transcluded content', function() {
      expect(element.children().children().is('.inner')).toBe(true)
    })
  })
  describe('directive', function() {
    it('should init and destroy iscroll', inject(function($timeout) {
      $timeout.flush()
      var iscroll = scope.getIScroll()
      expect(iscroll instanceof IScroll).toBe(true)
      expect(scope.getIScrollSticky() instanceof IScrollSticky).toBe(true)
      spyOn(iscroll, 'destroy')
      element.trigger('$destroy')
      expect(iscroll.destroy).toHaveBeenCalled()
    }))
  })
  describe('controller', function() {
    it('should set iscroll instance', function() {
      var foo = {}
      var bar = {}
      element.controller('bpIscroll').setIScroll(foo, bar)
      expect(scope.getIScroll()).toBe(foo)
      expect(scope.getIScrollSticky()).toBe(bar)
    })
  })
})
