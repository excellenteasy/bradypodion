describe 'tapDirective', ->

  beforeEach module 'ui.router'
  beforeEach module 'bp'

  scope   = null
  element = null
  tapped  = no
  compile = null

  beforeEach inject ($rootScope, $compile) ->
    scope   = $rootScope.$new()
    element = $compile('<div bp-tap>A</div>') scope
    scope.$apply()
    compile = $compile

    tapped = no
    element.on 'tap', ->
      tapped = yes

  testForCoordinates = (x,y,move) ->
    startEv = $.Event 'touchstart', originalEvent: {pageX: x, pageY: y}
    if move then moveEv = $.Event 'touchmove',
      originalEvent: {pageX: move.x, pageY: move.y}
    element.trigger startEv
    element.trigger moveEv if moveEv
    element.trigger 'touchend'

  describe 'standard attribute', ->
    it 'should emit tap event on touchend', ->
      testForCoordinates 0, 0
      expect(tapped).toBe true
      tapped = false
      testForCoordinates 1, 1
      expect(tapped).toBe true
      tapped = false
      testForCoordinates 150, 350
      expect(tapped).toBe true
      tapped = false

    it 'should emit tap event inside bound margin', ->
      testForCoordinates 0, 0, {x: 1, y: 1}
      expect(tapped).toBe true

    it 'should not emit tap event outside bound margin', ->
      testForCoordinates 0, 0, {x: 100, y: 100}
      expect(tapped).toBe false

    it 'should add active class on touchstart', ->
      element.trigger $.Event 'touchstart', originalEvent: {pageX: 0, pageY: 0}
      expect(element.hasClass 'bp-active').toBe true
      element.trigger 'touchend'
      expect(element.hasClass 'bp-active').toBe false

  describe 'custom options', ->
    it 'should respect bound margin setting via attribute', ->
      element = compile('<div bp-tap bp-bound-margin="0"></div>') scope
      testForCoordinates 0, 0, {x: 1, y: 1}
      expect(tapped).toBe false

  # test no-scroll
  # element = @$compile('<div bp-tap bp-no-scroll></div>') scope
  # TODO: Find a way to test this

    it 'should use custom active class when set via attribute', ->
      element = compile('<div bp-tap bp-active-class="a"></div>') scope
      element.trigger $.Event 'touchstart', originalEvent: {pageX: 0, pageY: 0}
      expect(element.hasClass 'a').toBe true
      expect(element.hasClass 'bp-active').toBe false
      element.trigger 'touchend'
      expect(element.hasClass 'a').toBe false

  # TODO: test allow-click

  describe 'intelligent defaults', ->
    it 'should apply bp-no-scroll attribute to an action inside a navbar', ->
      html = '<bp-navbar><bp-action bp-tap></bp-action></bp-navbar>'
      element = compile(html) scope
      expect(element.find('bp-action').attr 'bp-no-scroll').toBe ''

    it 'should apply bp-bound-margin=5 attribute to cell inside iscroll', ->
      html = '<div bp-iscroll><bp-cell bp-tap></bp-cell></div>'
      element = compile(html) scope
      expect(element.find('[bp-tap]').attr 'bp-bound-margin').toBe '5'

  # TODO: test bpConfig

