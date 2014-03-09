/**
@ngdoc object
@name bp.util.bpTapProvider
*/
angular.module('bp').provider('bpTap', function() {
  var globalConfig = {
    activeClass: 'bp-active',
    allowClick: false,
    boundMargin: 50,
    noScroll: false
  }

  /**
  @ngdoc function
  @name bp.util.bpTapProvider#setConfig
  @methodOf bp.util.bpTapProvider
  @param {object} config custom configuration
  @description Allows to modify and extend Tap configuration globally, so it applies throughout the framework.
  */
  this.setConfig = function(inConfig) {
    globalConfig = angular.extend(globalConfig, inConfig)
  }

  /**
  @ngdoc function
  @name bp.util.bpTap
  @param {element} element The element that should receive the `tap` event.
  @param {attrs=} attrs The element's attributes array as provided by the link function.
  @return {object} A `tap` object containing various information and references. Use `tap.disable()` on `$destroy` to prevent memory leaks.
  @description bpTap is a service that is used to fire a `tap` event without 300ms click delay on an element.
  */
  function bpTap(element, attrs) {
    var config = angular.copy(globalConfig)
    var touch = {}

    var _getCoordinate = function(e, isX) {
      var axis = isX ? 'pageX' : 'pageY'

      if (angular.isDefined(e.originalEvent)) {
        e = e.originalEvent
      }

      if (angular.isDefined(e[axis])) {
        return e[axis]
      } else if (angular.isObject(e.changedTouches) &&
        angular.isObject(e.changedTouches[0])) {

        return e.changedTouches[0][axis]
      } else {
        return 0
      }
    }

    var onClick = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if (angular.isFunction(e.stopImmediatePropagation)) {
        e.stopImmediatePropagation()
      }
    }

    var onTouchstart = function(e) {
      var $target = angular.element(e.target)
      touch.x = _getCoordinate(e, true)
      touch.y = _getCoordinate(e, false)
      touch.ongoing = true

      if ((angular.isDefined($target.attr('bp-tap')) || angular.isDefined($target.attr('bp-sref'))) &&
        element.get(0) !== e.target) {

        touch.nestedTap = true
      } else {
        element.addClass(config.activeClass)
      }
    }

    var onTouchmove = function(e) {
      var x = _getCoordinate(e, true)
      var y = _getCoordinate(e, false)

      if ((config.boundMargin != null) &&
        (Math.abs(touch.y - y) < config.boundMargin &&
          Math.abs(touch.x - x) < config.boundMargin)) {

        if (!touch.nestedTap) {
          element.addClass(config.activeClass)
        }

        touch.ongoing = true

        if (config.noScroll) {
          e.preventDefault()
        }
      } else {
        touch.ongoing = false
        element.removeClass(config.activeClass)
      }
    }

    var onTouchend = function(e) {
      if (touch.ongoing && !touch.nestedTap && e.type === 'touchend') {
        element.trigger('tap', touch)
      }
      element.removeClass(config.activeClass)
      delete touch.x
      delete touch.y
      delete touch.ongoing
      delete touch.nestedTap
    }

    var disable = function() {
      element.unbind('tap touchstart touchmove touchend touchcancel click')
    }

    var _setConfig = function(attrs) {
      var attrConfig = {}

      if ((element.is('bp-action') &&
        element.parent('bp-navbar')) ||
        element.is('bp-detail-disclosure')) {

        element.attr('bp-no-scroll', '')
        attrConfig.noScroll = true
      }

      if (element.parents('[bp-iscroll]').length) {
        element.attr('bp-bound-margin', '5')
        attrConfig.boundMargin = 5
      }

      if (angular.isObject(attrs)) {
        for (var key in config) {
          var attr = attrs['bp' + (key.charAt(0).toUpperCase()) + (key.slice(1))]
          if (angular.isDefined(attr)) {
            attrConfig[key] = attr === '' ? true : attr
          }
        }
      }

      angular.extend(config, attrConfig)
    }

    element.bind('touchstart', onTouchstart)
    element.bind('touchmove', onTouchmove)
    element.bind('touchend touchcancel', onTouchend)

    _setConfig(attrs)

    if ((!config.allowClick) && 'ontouchstart' in window) {
      element.bind('click', onClick)
    }

    return {
      touch: touch,
      options: config,
      disable: disable,
      onClick: onClick,
      onTouchstart: onTouchstart,
      onTouchmove: onTouchmove,
      onTouchend: onTouchend,
      _getCoordinate: _getCoordinate,
      _setConfig: _setConfig
    }
  }

  this.$get = function() {
    return bpTap
  }
})
