injector = angular.injector ['ng', 'bp']

module 'tap', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'tapDirective', ->
  element = @$compile('<div bp-tap></div>') @$scope
  ok true, 'Write your fuckin tests dude!'
