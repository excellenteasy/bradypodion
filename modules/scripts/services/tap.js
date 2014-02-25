angular.module('bp').factory('BpTap', function(bpConfig) {
  function BpTap(scope, element, attrs, customOptions) {
    this.element      = element
    this.touch        = {}
    this.onTouchend   = angular.bind(this, this.onTouchend)
    this.onTouchmove  = angular.bind(this, this.onTouchmove)
    this.onTouchstart = angular.bind(this, this.onTouchstart)

    element.bind('touchstart', this.onTouchstart)
    element.bind('touchmove', this.onTouchmove)
    element.bind('touchend touchcancel', this.onTouchend)

    this._setOptions(attrs, customOptions)

    if ((!this.options.allowClick) && 'ontouchstart' in window) {
      this.element.bind('click', this.onClick)
    }

    scope.$on('$destroy', function() {
      element.unbind('touchstart touchmove touchend touchcancel click')
    })
  }

  BpTap.prototype.onClick = function(e) {
    e.preventDefault()
    e.stopPropagation()
    if (angular.isFunction(e.stopImmediatePropagation)) {
      e.stopImmediatePropagation()
    }
  }

  BpTap.prototype.onTouchstart = function(e) {
    var $t
    this.touch.x        = this._getCoordinate(e, true)
    this.touch.y        = this._getCoordinate(e, false)
    this.touch.ongoing  = true
    $t                  = angular.element(e.target)

    if ((($t.attr('bp-tap') != null) ||
      ($t.attr('bp-sref') != null)) &&
      this.element.get(0) !== e.target) {

      this.touch.nestedTap = true
    } else {
      this.element.addClass(this.options.activeClass)
    }
  }

  BpTap.prototype.onTouchmove = function(e) {
    var x, y
    x = this._getCoordinate(e, true)
    y = this._getCoordinate(e, false)

    if ((this.options.boundMargin != null) &&
      (Math.abs(this.touch.y - y) < this.options.boundMargin &&
        Math.abs(this.touch.x - x) < this.options.boundMargin)) {

      if (!this.touch.nestedTap) {
        this.element.addClass(this.options.activeClass)
      }

      this.touch.ongoing = true

      if (this.options.noScroll) {
        e.preventDefault()
      }
    } else {
      this.touch.ongoing = false
      this.element.removeClass(this.options.activeClass)
    }
  }

  BpTap.prototype.onTouchend = function(e) {
    if (this.touch.ongoing && !this.touch.nestedTap && e.type === 'touchend') {
      this.element.trigger('tap', this.touch)
    }
    this.touch = {}
    this.element.removeClass(this.options.activeClass)
  }

  BpTap.prototype._setOptions = function(attrs, customOptions) {
    if (attrs == null) {
      attrs = {}
    }
    if (customOptions == null) {
      customOptions = {}
    }

    var options = angular.extend({
      activeClass: 'bp-active',
      allowClick: false,
      boundMargin: 50,
      noScroll: false
    }, bpConfig.tap || {})

    if ((this.element.is('bp-action') &&
      this.element.parent('bp-navbar')) ||
      this.element.is('bp-detail-disclosure')) {

      this.element.attr('bp-no-scroll', '')
      options.noScroll = true
    }

    if (this.element.parents('[bp-iscroll]').length) {
      this.element.attr('bp-bound-margin', '5')
      options.boundMargin = 5
    }

    angular.extend(options, customOptions)

    for (var key in options) {
      var attr = attrs['bp' + (key.charAt(0).toUpperCase()) + (key.slice(1))]
      if (attr != null) {
        options[key] = attr === '' ? true : attr
      }
    }

    this.options = options
  }

  BpTap.prototype._getCoordinate = function(e, isX) {
    var axis
    axis = isX ? 'pageX' : 'pageY'

    if (e.originalEvent != null) {
      e = e.originalEvent
    }

    if (e[axis] != null) {
      return e[axis]
    } else if (angular.isObject(e.changedTouches) &&
      angular.isObject(e.changedTouches[0])) {

      return e.changedTouches[0][axis]
    } else {
      return 0
    }
  }

  return BpTap
})
