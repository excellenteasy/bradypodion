/**
@ngdoc object
@name bp.util.bpConfigProvider
*/
angular.module('bp.util').provider('bpConfig', (function() {
  var config = {
    platform: 'ios'
  }

  function BpConfig() {
    config.setConfig = this.setConfig
  }

  /**
  @ngdoc object
  @name bp.util.bpConfig
  @description
  Contains the Bradypodion configuration object, which is used internally for post-platform abstractions.
  */
  BpConfig.prototype.$get = function() {
    return config
  }

  /**
  @ngdoc function
  @name bp.util.bpConfigProvider#setConfig
  @methodOf bp.util.bpConfigProvider
  @param {object} config custom configuration
  @description Allows to modify Bradypodion configuration.
  The default configuration is `{platform: 'ios'}`.
  You may change the platform globally, or set some iScroll settings on `config.iscoll`.
  */
  /**
  @ngdoc function
  @name bp.util.bpConfig#setConfig
  @methodOf bp.util.bpConfig
  @param {object} config custom configuration
  @description
  <div class="alert">
    Using this method on runtime may cause an inconsistent app state.
    It's recommend to use it on the {@link bp.util.bpConfigProvider#setConfig provider}.
  </div>
  */
  BpConfig.prototype.setConfig = function(inConfig) {
    config = angular.extend(config, inConfig)
  }

  return BpConfig
})())
