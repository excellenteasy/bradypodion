###
  bradypodion config factory
  @since 0.1.0
###
config = ($injector) ->
  try
    bpUserConfig = $injector.get('bpUserConfig')
  angular.extend
    platform: 'ios'
  , bpUserConfig or {}

angular.module('bp.factories').factory 'bpConfig', config
