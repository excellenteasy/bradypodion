injector = angular.injector ['ng', 'bp']

module 'body', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'bodyDirective', ->
  element = @$compile('<body></body>') @$scope
  @$scope.$apply()

  ok element.hasClass @$scope.config.platform, 'test'

  @$scope.config.platform = 'android'
  @$scope.$apply()
  ok element.hasClass @$scope.config.platform, 'foo'
