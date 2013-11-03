# # Config

angular.module('bp.factories').provider 'bpConfig', ->
  @defaultConfig =
    platform: 'ios'
  @userConfig =
    noUserConfig: yes

  @$get = -> angular.extend @defaultConfig, @userConfig

  @setConfig = (config) -> @userConfig = config
