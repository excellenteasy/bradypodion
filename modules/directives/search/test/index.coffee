injector = angular.injector ['ng', 'bp']

module 'search', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'searchDirective', ->
  element = @$compile('<bp-search</bp-search>') @$scope
  ok true, 'Write your fuckin tests dude!'
