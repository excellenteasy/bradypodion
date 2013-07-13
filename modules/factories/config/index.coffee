###
  bradypodion config factory
  @since 0.1.0
###
config = (bpUserConfig) ->
  angular.extend
    platform: 'ios'
  , bpUserConfig
###
  bradypodion userConfig factory
  @note meant to be overwritten
  @since 0.1.0
###
userConfig = ->
  noUserConfig: yes

angular.module('bp.factories').factory 'bpConfig', config
angular.module('bp.factories').factory 'bpUserConfig', userConfig
