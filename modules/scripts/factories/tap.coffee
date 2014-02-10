# Tap

angular.module('bp').factory 'Tap', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  class Tap
    constructor: (scope, element, attrs, customOptions) ->
      options = @_getOptions arguments...

      touch     = {}
      @getTouch = -> touch
      @setTouch = (newTouch) -> touch = newTouch

      if (not options.allowClick) and 'ontouchstart' of window
        element.bind 'click', @onClick

      scope.$on '$destroy', => @onDestroy element

      element.bind 'touchstart', (e) =>
        @onTouchstart e, scope, element, touch, options
      element.bind 'touchmove',  (e) =>
        @onTouchmove  e, scope, element, touch, options
      element.bind 'touchend',   (e) =>
        @onTouchend   e, scope, element, touch, options

    onClick: (e) ->
      e.preventDefault?()
      e.stopPropagation?()
      e.stopImmediatePropagation?()

    onDestroy: (element) ->
      element.unbind 'touchstart touchmove touchend touchcancel click'

    onTouchstart: (e, scope, element, touch, options) ->
      touch.x = @_getCoordinate e, yes
      touch.y = @_getCoordinate e, no
      touch.ongoing = yes
      $t = $(e.target)
      if ($t.attr('bp-tap') or $t.attr('bp-sref')) and element[0] isnt e.target
        touch.nestedTap = yes
      else
        element.addClass options.activeClass

    onTouchmove: (e, scope, element, touch, options) ->
      x = @_getCoordinate e, yes
      y = @_getCoordinate e, no
      if options.boundMargin and
         (Math.abs(touch.y - y) < options.boundMargin and
         Math.abs(touch.x - x) < options.boundMargin)
        element.addClass options.activeClass unless touch.nestedTap
        touch.ongoing = on
        if options.noScroll
          e.preventDefault()
      else
        touch.ongoing = no
        element.removeClass options.activeClass

    onTouchend: (e, scope, element, touch, options) ->
      if touch.ongoing and not touch.nestedTap and e.type is 'touchend'
        element.trigger 'tap', touch
      touch = {}
      element.removeClass options.activeClass

    _getOptions: (scope, element, attrs, customOptions) ->
      # Default Options
      options =
        activeClass: 'bp-active'
        allowClick:  no
        boundMargin: 50
        noScroll:    no

      # Global Options
      options = angular.extend options, bpConfig.tap or {}

      if (element.is('bp-action') and element.parent('bp-navbar')) or
         element.is('bp-detail-disclosure')
        element.attr 'bp-no-scroll', ''
        options.noScroll = yes

      if element.parents('[bp-iscroll]').length
        element.attr 'bp-bound-margin', '5'
        options.boundMargin = 5

      # Programatic Custom Options
      angular.extend options, customOptions or {}

      # Element Options
      for key of options
        attr = attrs["bp#{key.charAt(0).toUpperCase()}#{key.slice(1)}"]
        if attr?
          options[key] = if attr is '' then true else attr

      options

    _getCoordinate: (e, isX) ->
      axis = if isX then 'pageX' else 'pageY'
      e = e.originalEvent if e.originalEvent?
      if e[axis]?
        e[axis]
      else if e.changedTouches?[0]?
        e.changedTouches[0][axis]
      else
        0
