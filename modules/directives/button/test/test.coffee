injector = angular.injector ['ng', 'bp']

module 'button', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'buttonDirective', ->
  element = @$compile('<div class="bp-button" title="test"></div>') @$scope
  equal @$scope.title, 'test'

