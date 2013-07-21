injector = angular.injector ['ng', 'bp']

module 'table-header', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'tableHeaderDirective', ->
  element = @$compile('<bp-table-header>A</bp-table-header>') @$scope
  equal element.attr('role'), 'heading', 'has role heading'
