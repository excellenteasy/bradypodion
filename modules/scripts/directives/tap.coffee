# # Tap
# ## Description
# The `bpTap` allows you to specify custom behavior when element is tapped.
# ## Usage
# as attribute
# `<ANY bp-tap="{expression}">`
# ### Parameters
# * `ngClick` – `{expression}` Expression to evaluate upon tap.
angular.module('bp.directives').directive 'bpTap', deps [
  'bpConfig'
  '$parse'
  ], (
  bpConfig
  $parse
  ) ->
  (scope, element, attrs) ->
    # ### Options
    # You can specify some options as attributes to control the behavior.
    options = angular.extend
      # * `bp-no-scroll` – Prevent page scroll when moving after touchstart
      noScroll: no
      # * `bp-active-class - `CSS class` - Class to add during tap
      activeClass: 'bp-active'
      # * `bp-bound-margin - `int` - Pixels allowed to move to fire tap
      boundMargin: 50
      # * `bp-allow-click - Fire click and tap events
      allowClick: no
    , bpConfig.tap or {}

    for key of options
      attr = attrs["bp#{key.charAt(0).toUpperCase()}#{key.slice(1)}"]
      if attr?
        options[key] = if attr is '' then true else attr

    # #### Intelligent Defaults
    # * Apply `bp-no-scroll` to  `bp-button` within `bp-navbar`
    if (element.is('bp-button') and element.parent('bp-navbar')) or
       # * Apply `bp-no-scroll` to  `bp-detail-disclosure`
       element.is('bp-detail-disclosure')
      element.attr 'bp-no-scroll', ''
      options.noScroll = yes
    # * Set `bp-bound-margin` to 5 when `bp-cell` is within `bp-iscroll`
    if element.parents('[bp-iscroll]').length
      element.attr 'bp-bound-margin', '5'
      options.boundMargin = 5

    touch = {}

    element.bind 'touchstart', (e) ->
      touch.y =
        if e.originalEvent.pageY
          e.originalEvent.pageY
        else if e.originalEvent.changedTouches?[0]?
          e.originalEvent.changedTouches[0].pageY
        else
          0
      touch.x =
        if e.originalEvent.pageX
          e.originalEvent.pageX
        else if e.originalEvent.changedTouches?[0]?
          e.originalEvent.changedTouches[0].pageX
        else
          0
      touch.ongoing = yes
      if $(e.target).attr('bp-tap') and element[0] isnt e.target
        touch.nestedTap = yes
      else
        element.addClass options.activeClass

    element.bind 'touchmove', (e) ->
      y =
        if e.originalEvent.pageY
          e.originalEvent.pageY
        else if e.originalEvent.changedTouches?[0]?
          e.originalEvent.changedTouches[0].pageY
        else
          0
      x =
        if e.originalEvent.pageX
          e.originalEvent.pageX
        else if e.originalEvent.changedTouches?[0]?
          e.originalEvent.changedTouches[0].pageX
        else
          0
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

    element.bind 'touchend touchcancel', (e) ->
      if touch.ongoing and not touch.nestedTap and e.type is 'touchend'
        scope.$apply $parse(attrs.bpTap), {$event: e, touch}
        element.trigger 'tap', angular.extend {type: 'tap', touch}, e
      touch = {}
      element.removeClass options.activeClass

    if (not options.allowClick) and 'ontouchstart' of window
      element.bind 'click', (e) ->
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

    scope.$on '$destroy', ->
      element.unbind 'touchstart touchmove touchend touchcancel click'
