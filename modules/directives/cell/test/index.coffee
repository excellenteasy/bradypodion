injector = angular.injector ['ng', 'bp']

module 'cell', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'cellDirective', ->
  expect 2
  text    = 'Some Test'
  element = @$compile("<bp-cell>#{text}</bp-cell>") @$scope

  equal element.attr('role'), 'listitem', 'role is listitem'
  equal text, element.text(), 'text'
