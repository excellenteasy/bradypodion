injector = angular.injector ['ng', 'bp']

module 'body', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'bodyDirective', ->
  ok true, 'Write some tests'
