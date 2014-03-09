/**
@ngdoc object
@name bp.util.bpAppProvider
*/
angular.module('bp.util').provider('bpApp', function() {
  var config = {
    platform: 'ios'
  }

  /**
  @ngdoc function
  @name bp.util.bpAppProvider#setConfig
  @methodOf bp.util.bpAppProvider
  @param {object} config custom configuration
  @param {bool=} overwrite `true` overwrites (rather than extends) the config.
  @description Allows to modify Bradypodion configuration.
  */
  this.setConfig = function(inConfig, overwrite) {
    if (overwrite && inConfig.platform) {
      config = inConfig
    } else {
      config = angular.extend(config, inConfig)
    }
  }

  /**
  @ngdoc object
  @name bp.util.bpApp
  @description
  Contains the Bradypodion configuration object, which is used internally for post-platform abstractions.
  The default is `{platform: 'ios'}` and the only other valid value for `platform` currently is `'android'`.

  <div class="alert alert-info">
    At the moment this is only used to set the platform of the Bradypodion app,
    but in future versions it will be more important as it may contain information about the device (tablet/phone) or the environment (web/native wrapper) etc.
  </div>

  <div class="alert">
    The returned object is not just a copy, but a reference to the configuration object.
    This means you can change it app-wide on runtime, but this may cause an inconsistent app state.
    It's recommend to alter configuration with the {@link bp.util.bpAppProvider#setConfig provider} method.
  </div>
  */
  this.$get = function() {
    return config
  }
})
