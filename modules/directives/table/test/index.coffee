injector = angular.injector ['ng', 'bp']

module 'table', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'tableDirective', ->
  expect 1
  element = @$compile('<bp-table></bp-table>') @$scope
  equal element.attr('role'), 'list', 'has role list'
