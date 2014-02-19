angular.module('bp').provider('bpConfig', (function() {
  var BpConfig;
  return BpConfig = (function() {
    var config;

    config = {
      platform: 'ios'
    };

    function BpConfig() {
      config.setConfig = this.setConfig;
    }

    BpConfig.prototype.$get = function() {
      return config;
    };

    BpConfig.prototype.setConfig = function(inConfig) {
      return config = angular.extend(config, inConfig);
    };

    return BpConfig;

  })();
})());
