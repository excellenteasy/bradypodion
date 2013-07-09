injector = angular.injector ['ng', 'button']

module 'button', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'buttonDirective', ->
  element = @$compile('<div class="button" title="test"></div>') @$scope
  equal @$scope.title, 'test'

