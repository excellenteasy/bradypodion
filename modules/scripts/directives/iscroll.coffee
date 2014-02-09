# # iScroll

angular.module('bp').directive 'bpIscroll', deps [
  'bpConfig'
  '$timeout'
  ], (
  bpConfig
  $timeout
  ) ->
  transclude: yes
  template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>'
  link: (scope, element, attrs) ->
    iscroll = {}

    scope.getIScroll = -> iscroll

    # TODO: detect if animation/transition is happening and wait
    delay = 0

    # merge defaults with global user options
    options = angular.extend
      delay: delay
      stickyHeadersSelector: 'bp-table-header'
      scrollbarsEnabled: yes
    , bpConfig.iscroll or {}

    # Scrollbar Y options
    if attrs.bpIscrollNoScrollbars?
      options.scrollbarsEnabled = no

    # Sticky Headers Options
    if attrs.bpIscrollSticky?
      options.stickyHeadersEnabled  = yes
      unless attrs.bpIscrollSticky is ''
        options.stickyHeadersSelector = attrs.bpIscrollSticky

    # create IScroll instance on element
    instanciateIScroll = ->
      iscroll = new IScroll element[0],
        probeType: 3
        scrollbars: options.scrollbarsEnabled
      if options.stickyHeadersEnabled and bpConfig.platform isnt 'android'
        new IScrollSticky iscroll, options.stickyHeadersSelector

    # schedule IScroll instantication
    $timeout instanciateIScroll, options.delay

    scope.$on 'bpRefreshIScrollInstances', ->
      scope.getIScroll()?.refresh?()

    element.on '$destroy', ->
      iscroll.destroy()
