injector = angular.injector ['ng', 'bp']

module 'button', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'buttonDirective', ->
  element = @$compile('<bp-button></bp-button>') @$scope
  ok true, 'test'

