# # iScroll

angular.module('bp.directives').directive 'bpIscroll', deps [
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

    # only use a delay if an animation will be played during transition
    delay =
      if element.parents('[ng-animate]').length
        transition = scope.getFullTransition?()
        if not transition or transition.split('-')[0] is ''
          0
        else
          500
      else
        0

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

    scope.$on '$destroy', -> iscroll.destroy()

    scope.$on '$stateChangeStart', ->
      iscroll.destroy()
      element.removeAttr 'bp-iscroll'
      element.find('bp-iscroll-wrapper').css
        position: 'static'
        transform: ''
        transition: ''
