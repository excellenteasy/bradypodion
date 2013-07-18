# # Config

angular.module('bp.factories').factory 'bpConfig', [
  'bpUserConfig'
  (bpUserConfig) ->
    angular.extend
      platform: 'ios'
    , bpUserConfig
  ]

angular.module('bp.factories').factory 'bpUserConfig', ->
  noUserConfig: yes
