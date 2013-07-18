# # Config

config = (bpUserConfig) ->
  angular.extend
    platform: 'ios'
  , bpUserConfig

userConfig = ->
  noUserConfig: yes

angular.module('bp.factories').factory 'bpConfig', config
angular.module('bp.factories').factory 'bpUserConfig', userConfig
