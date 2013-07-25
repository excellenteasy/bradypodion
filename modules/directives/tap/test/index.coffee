injector = angular.injector ['ng', 'bp']

module 'tap', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'tapDirective', ->
  expect 11

  # test standard tap
  element = @$compile('<div bp-tap></div>') @$scope

  element.on 'tap', ->
    ok yes, 'tap callback works'
    start()

  stop()

  testForCoordinates = (x,y,move) ->
    startEv = $.Event 'touchstart', originalEvent: {pageX: x, pageY: y}
    if move then moveEv = $.Event 'touchmove',
      originalEvent: {pageX: move.x, pageY: move.y}
    element.trigger startEv
    element.trigger moveEv if moveEv
    element.trigger 'touchend'

  testForCoordinates 0, 0
  testForCoordinates 1, 1
  testForCoordinates 150, 350

  # test bound margin (default and custom)
  element.off 'tap'
  element.on 'tap', ->
    ok true, 'trigger tap when moving 1px with default boundMargin'
    start()

  testForCoordinates 0, 0, {x: 1, y: 1}
  testForCoordinates 0, 0, {x: 10, y: 10} # this should not trigger a tap

  element.off 'tap'
  element = @$compile('<div bp-tap bp-bound-margin="0"></div>') @$scope
  element.on 'tap', ->
    ok false, 'should not trigger tap on zero bound margin'
    start()

  testForCoordinates 0, 0, {x: 1, y: 1}

  # test no-scroll
  # element = @$compile('<div bp-tap bp-no-scroll></div>') @$scope
  # TODO: Find a way to test this

  # test active-class (default and custom)
  element = @$compile('<div bp-tap></div>') @$scope
  element.trigger $.Event 'touchstart', originalEvent: {pageX: 0, pageY: 0}
  ok element.hasClass('bp-active'),
    'default active-class is set on touchstart'
  element.trigger 'touchend'
  ok not element.hasClass('bp-active'),
    'default active-class was removed on touchend'

  element = @$compile('<div bp-tap bp-active-class="a"></div>') @$scope
  element.trigger $.Event 'touchstart', originalEvent: {pageX: 0, pageY: 0}
  ok element.hasClass('a'), 'custom active-class is set on touchstart'
  element.trigger 'touchend'
  ok not element.hasClass('a'), 'custom active-class was removed on touchend'

  # TODO: test allow-click

  # test intelligent defaults
  element =
    @$compile('<bp-navbar><bp-button bp-tap></bp-button></bp-navbar>') @$scope
  equal element.find('bp-button').attr('bp-no-scroll'), '', 'auto no-scroll'

  element =
    @$compile('<div bp-iscroll><bp-cell bp-tap></bp-cell></div>') @$scope
  equal element.find('[bp-tap]').attr('bp-bound-margin'), '5',
    'auto bound margin is 5'

  # TODO: test bpConfig

