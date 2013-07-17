###
  bradypodion iscroll directive
  @since 0.1.0
  @example description of iscroll example
    <div bp-iscroll></div>
  @return [Object<restrict|template|link>] Angular directive
###
iscroll = (bpConfig, $timeout) ->
  transclude: yes
  template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>'
  link: (scope, element, attrs) ->

    # merge defaults with global user options
    options = angular.extend
      delay: 0
      stickyHeadersSelector: 'h1'
    , bpConfig.iscroll or {}

    # Sticky Headers Options
    if attrs.bpIscrollSticky?
      options.stickyHeadersEnabled  = yes
      if attrs.bpIscrollSticky isnt ''
        options.stickyHeadersSelector = attrs.bpIscrollSticky

    # create IScroll instance on element
    instanciateIScroll = ->
      iscroll = new IScroll element[0], {probeType: 3}
      if options.stickyHeadersEnabled
        new IScrollSticky iscroll, options.stickyHeadersSelector

    # schedule IScroll instantication
    $timeout instanciateIScroll, options.delay

angular.module('bp.directives').directive 'bpIscroll', iscroll
