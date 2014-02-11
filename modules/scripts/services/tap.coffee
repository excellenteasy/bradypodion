# Tap

angular.module('bp').factory 'Tap', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  class Tap

    constructor: (scope, @element, attrs, customOptions) ->
      @touch = {}
      @_setOptions attrs, customOptions

      if (not @options.allowClick) and 'ontouchstart' of window
        @element.bind 'click', @onClick

      @element.bind 'touchstart', @onTouchstart

      @element.bind 'touchmove', @onTouchmove

      @element.bind 'touchend touchcancel', @onTouchend

      scope.$on '$destroy', =>
        @element.unbind 'touchstart touchmove touchend touchcancel click'

    onClick: (e) ->
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation?()
      return

    onTouchstart: (e) =>
      @touch.x = @_getCoordinate e, yes
      @touch.y = @_getCoordinate e, no
      @touch.ongoing = yes
      $t = $(e.target)
      if ($t.attr('bp-tap')? or $t.attr('bp-sref')?) and
         @element.get(0) isnt e.target
        @touch.nestedTap = yes
      else
        @element.addClass @options.activeClass
      return

    onTouchmove: (e) =>
      x = @_getCoordinate e, yes
      y = @_getCoordinate e, no
      if @options.boundMargin? and
         (Math.abs(@touch.y - y) < @options.boundMargin and
         Math.abs(@touch.x - x) < @options.boundMargin)
        @element.addClass @options.activeClass unless @touch.nestedTap
        @touch.ongoing = yes
        if @options.noScroll
          e.preventDefault()
      else
        @touch.ongoing = no
        @element.removeClass @options.activeClass
      return

    onTouchend: (e) =>
      if @touch.ongoing and not @touch.nestedTap and e.type is 'touchend'
        @element.trigger 'tap', @touch
      @touch = {}
      @element.removeClass @options.activeClass
      return

    _setOptions: (attrs = {}, customOptions = {}) ->
      # Default Options
      options =
        activeClass: 'bp-active'
        allowClick:  no
        boundMargin: 50
        noScroll:    no

      # Glxwobal Options
      options = angular.extend options, bpConfig.tap or {}

      if (@element.is('bp-action') and @element.parent('bp-navbar')) or
         @element.is('bp-detail-disclosure')
        @element.attr 'bp-no-scroll', ''
        options.noScroll = yes

      if @element.parents('[bp-iscroll]').length
        @element.attr 'bp-bound-margin', '5'
        options.boundMargin = 5

      # Programatic Custom Options
      angular.extend options, customOptions

      # Element Options
      for key of options
        attr = attrs["bp#{key.charAt(0).toUpperCase()}#{key.slice(1)}"]
        if attr?
          options[key] = if attr is '' then true else attr

      @options = options

    _getCoordinate: (e, isX) ->
      axis = if isX then 'pageX' else 'pageY'
      e = e.originalEvent if e.originalEvent?
      if e[axis]?
        e[axis]
      else if e.changedTouches?[0]?
        e.changedTouches[0][axis]
      else
        0
