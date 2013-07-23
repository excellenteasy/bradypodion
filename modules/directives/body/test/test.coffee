injector = angular.injector ['ng', 'bp']

module 'body',
  setup: ->
    @$scope   = injector.get('$rootScope').$new()
    @$compile = injector.get '$compile'
    @bpConfig = injector.get 'bpConfig'
    @pristineConfig = _.clone @bpConfig
  teardown: ->
    for key, value of @pristineConfig
      @bpConfig[key] = value

test 'bodyDirective', ->
  element = @$compile('<body></body>') @$scope
  @$scope.$apply()

  ok element.hasClass 'ios', 'element has default class ios'
  ok element.hasClass @$scope.config.platform, 'element has platform as class'

  @$scope.config.platform = 'ios7'
  @$scope.$apply()
  ok element.hasClass 'ios7', 'element has class ios7'
  ok element.hasClass @$scope.config.platform, 'element has platform as class'

  @$scope.config.platform = 'android'
  @$scope.$apply()
  ok element.hasClass 'android', 'element has class android'
  ok element.hasClass @$scope.config.platform, 'element has platform as class'


