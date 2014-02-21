angular.module('bp').provider('bpConfig', (function() {
  var config = {
    platform: 'ios'
  }

  function BpConfig() {
    config.setConfig = this.setConfig
  }

  BpConfig.prototype.$get = function() {
    return config
  }

  BpConfig.prototype.setConfig = function(inConfig) {
    config = angular.extend(config, inConfig)
  }

  return BpConfig

})())
