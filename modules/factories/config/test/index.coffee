angular.module('test', ['bp']).factory 'bpUserConfig', ->
  randomProperty: 'random'
injector = angular.injector ['ng', 'test']

module 'config',
  setup: ->
    @$scope   = injector.get('$rootScope').$new()
    @$compile = injector.get '$compile'
    @bpConfig = injector.get 'bpConfig'
    @pristineConfig = _.clone @bpConfig
  teardown: ->
    for key, value of @pristineConfig
      @bpConfig[key] = value

test 'configFactory', ->
  equal @bpConfig.platform, 'ios', 'default config exposed'
  equal @bpConfig.randomProperty, 'random', 'user config exposed'