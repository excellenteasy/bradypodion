injector = angular.injector ['ng', 'bp']

module 'button', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'buttonDirective', ->
  element = @$compile('<bp-button title="test"></bp-button>') @$scope
  equal @$scope.title, 'test'

