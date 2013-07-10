injector = angular.injector ['ng', 'bp']

module 'cell', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'cellDirective', ->
  element = @$compile('<bp-cell</bp-cell>') @$scope
  ok true, 'Write your fuckin tests dude!'
