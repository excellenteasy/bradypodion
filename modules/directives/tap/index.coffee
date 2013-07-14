###
  bradypodion tap directive
  @since 0.1.0
  @example description of tap example
    <div bp-tap></div>
  @return [Object<restrict|template|link>] Angular directive
###
tap = (bpConfig) ->
  link: (scope, element, attrs) ->
    options = angular.extend
      noScroll: no
      activeClass: 'bp-active'
      boundMargin: 50
      allowClick: no
    , bpConfig.tap or {}

    for key of options
      attr = attrs['bp' + key.charAt(0).toUpperCase() + key.slice(1)]
      if attr? then options[key] = switch attr
        when 'true'  then true
        when 'false' then false
        else attr

    touch = {}

    element.bind 'touchstart', (e) ->
      touch.y = e.originalEvent.pageY or
        e.originalEvent.changedTouches[0].pageY
      touch.x = e.originalEvent.pageX or
        e.originalEvent.changedTouches[0].pageX
      touch.ongoing = yes
      element.addClass options.activeClass
    element.bind 'touchmove', (e) ->
      y = e.originalEvent.pageY or
        e.originalEvent.changedTouches[0].pageY
      x = e.originalEvent.pageX or
        e.originalEvent.changedTouches[0].pageX
      if options.boundMargin and
         (Math.abs(touch.y - y) < options.boundMargin and
         Math.abs(touch.x - x) < options.boundMargin)
        element.addClass options.activeClass
        touch.ongoing = on
        if options.noScroll
          e.preventDefault()
      else
        touch.ongoing = no
        element.removeClass options.activeClass
    element.bind 'touchend touchcancel', (e) ->
      if touch.ongoing and e.type is 'touchend'
        scope.$apply attrs['bpTap'], element
      touch = {}
      element.removeClass options.activeClass

    if (not options.allowClick) and 'ontouchstart' of window
      element.bind 'click', (e) ->
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

angular.module('bp.directives').directive 'bpTap', tap