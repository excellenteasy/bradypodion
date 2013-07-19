# # Config

angular.module('bp.factories').factory 'bpConfig', deps [
  'bpUserConfig'
  ], (
  bpUserConfig
  ) ->
  angular.extend
    platform: 'ios'
  , bpUserConfig

angular.module('bp.factories').factory 'bpUserConfig', ->
  noUserConfig: yes
