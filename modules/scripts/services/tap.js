var __bind = function(fn, me) { return function() { return fn.apply(me, arguments)  }  }

angular.module('bp').factory('BpTap', function(bpConfig) {
  function BpTap(scope, element, attrs, customOptions) {
    this.element = element
    this.onTouchend = __bind(this.onTouchend, this)
    this.onTouchmove = __bind(this.onTouchmove, this)
    this.onTouchstart = __bind(this.onTouchstart, this)
    this.touch = {}
    this._setOptions(attrs, customOptions)
    if ((!this.options.allowClick) && 'ontouchstart' in window) {
      this.element.bind('click', this.onClick)
    }
    this.element.bind('touchstart', this.onTouchstart)
    this.element.bind('touchmove', this.onTouchmove)
    this.element.bind('touchend touchcancel', this.onTouchend)
    scope.$on('$destroy', (function(_this) {
      return function() {
        _this.element.unbind('touchstart touchmove touchend touchcancel click')
      }
    })(this))
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
    this.touch.x = this._getCoordinate(e, true)
    this.touch.y = this._getCoordinate(e, false)
    this.touch.ongoing = true
    $t = angular.element(e.target)
    if ((($t.attr('bp-tap') != null) || ($t.attr('bp-sref') != null)) && this.element.get(0) !== e.target) {
      this.touch.nestedTap = true
    } else {
      this.element.addClass(this.options.activeClass)
    }
  }

  BpTap.prototype.onTouchmove = function(e) {
    var x, y
    x = this._getCoordinate(e, true)
    y = this._getCoordinate(e, false)
    if ((this.options.boundMargin != null) && (Math.abs(this.touch.y - y) < this.options.boundMargin && Math.abs(this.touch.x - x) < this.options.boundMargin)) {
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
    var attr, key, options
    if (attrs == null) {
      attrs = {}
    }
    if (customOptions == null) {
      customOptions = {}
    }
    options = {
      activeClass: 'bp-active',
      allowClick: false,
      boundMargin: 50,
      noScroll: false
    }
    options = angular.extend(options, bpConfig.tap || {})
    if ((this.element.is('bp-action') && this.element.parent('bp-navbar')) || this.element.is('bp-detail-disclosure')) {
      this.element.attr('bp-no-scroll', '')
      options.noScroll = true
    }
    if (this.element.parents('[bp-iscroll]').length) {
      this.element.attr('bp-bound-margin', '5')
      options.boundMargin = 5
    }
    angular.extend(options, customOptions)
    for (key in options) {
      attr = attrs['bp' + (key.charAt(0).toUpperCase()) + (key.slice(1))]
      if (attr != null) {
        options[key] = attr === '' ? true : attr
      }
    }
    this.options = options
  }

  BpTap.prototype._getCoordinate = function(e, isX) {
    var axis, _ref
    axis = isX ? 'pageX' : 'pageY'
    if (e.originalEvent != null) {
      e = e.originalEvent
    }
    if (e[axis] != null) {
      return e[axis]
    } else if (((_ref = e.changedTouches) != null ? _ref[0] : void 0) != null) {
      return e.changedTouches[0][axis]
    } else {
      return 0
    }
  }

  return BpTap
})
