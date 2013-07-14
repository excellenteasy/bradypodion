injector = angular.injector ['ng', 'bp']

module 'navbar', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'navbarDirective', ->
  element = @$compile('<bp-navbar</bp-navbar>') @$scope
  ok true, 'Write your fuckin tests dude!'
