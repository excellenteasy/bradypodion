/**
@ngdoc object
@name bp.iscroll.bpIscrollProvider
*/
angular.module('bp.iscroll').provider('bpIscroll', function() {
  var config = {
    probeType: 3,
    scrollbars: true,
    click: true
  }

  /**
  @ngdoc function
  @name bp.iscroll.bpIscrollProvider#setConfig
  @methodOf bp.iscroll.bpIscrollProvider
  @param {object} config custom configuration
  @description Allows to modify and extend iScroll configuration globally, so it applies throughout the framework.
  */
  this.setConfig = function(inConfig) {
    config = angular.extend(config, inConfig)
  }

  /**
  @ngdoc object
  @name bp.iscroll.bpIscroll
  @description An object containing iScroll configuration.
  */
  this.$get = function() {
    return config
  }
})
