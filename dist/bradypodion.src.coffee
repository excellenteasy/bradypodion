'use strict'
###!
 * Bradypodion - build maintainable mobile web apps that don't suck.
 * @link https://github.com/excellenteasy/bradypodion
 * @license none
###

modules = [
  'animations'
  'directives'
  'factories'
  'controllers'
  'services'
]

modules = for module in modules
  inject = []
  if module is 'controllers' then inject.push('bp.services')
  if module is 'animations'  then inject.push('ngAnimate')
  angular.module (namespaced = "bp.#{module}"), inject
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps

# # # Flip

# flip = (dir = 'normal', name = 'flip', duration = 500) ->
#   sign = if dir is 'normal' then '' else '-'

#   angular.module('bp.animations').animation ".#{name}-#{dir}-enter", deps [
#     '$timeout'
#     ], (
#     $timeout
#     ) ->
#     setup: (element) ->
#       view    = element.parent('[ui-view]')
#         .addClass('flip-normal-view')
#         .css
#           transition: "all #{duration/2000}s ease-in"
#           transform:  'translate3d(0,0,0) rotateY(0deg)'
#       wrapper = view.parent().addClass 'flip-normal-wrapper'
#       { view, wrapper }

#     start: (element, done, elements) ->
#       width = elements.view.outerWidth()
#       elements.view.css
#         transform: "translate3d(0,0,-#{width}px) rotateY(#{sign}90deg)"
#       $timeout ->
#         elements.view.css
#           transition: "all #{duration/2000}s ease-out"
#           transform:  "translate3d(0,0,0) rotateY(#{sign}180deg)"

#       , duration/2
#       $timeout ->
#         elements.view
#           .removeClass('flip-normal-view')
#           .css
#             transition: ''
#             transform: ''
#         elements.wrapper.removeClass 'flip-normal-wrapper'
#         done()
#       , duration

#   angular.module('bp.animations').animation ".#{name}-#{dir}-leave", deps [
#     '$timeout'
#     ], (
#     $timeout
#     ) ->
#     start: (e, done) ->
#       $timeout done, duration

# flip()
# flip 'reverse'

# # ViewCtrl

angular.module('bp.controllers').controller 'bpViewCtrl', deps [
  'bpViewService'
  ], (
  bpViewService
  ) ->

# # Body

angular.module('bp.directives').directive 'body', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    scope.config = bpConfig
    latestPlatform = scope.config.platform
    element
      .addClass(scope.config.platform)
      .attr
        role: 'application'

# # Button

angular.module('bp.directives').directive 'bpButton', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    attributes =
      role: 'button'

    if element.hasClass('bp-button-back') and not attrs['aria-label']
      attributes['aria-label'] = if label = element.text()
        "Back to #{label}"
      else
        "Back"

    element.attr attributes

# # Cell

angular.module('bp.directives').directive 'bpCell', ->
  restrict: 'E'
  transclude: true
  template: ''
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        element
          .attr(
            role: 'listitem')
          .append clone

# # Detail Disclosure

angular.module('bp.directives').directive 'bpDetailDisclosure', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    if bpConfig.platform is 'android'
      element.attr 'aria-hidden', 'true'
    else
      $parent = element.parent()

      unless uniqueId = $parent.attr 'id'
        uniqueId = _.uniqueId 'bp_'
        $parent.attr 'id', uniqueId

      element.attr
        'aria-describedby': uniqueId
        'aria-label': 'More Info'
        role: 'button'

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

    scope.$on '$destroy', -> iscroll.destroy()

    scope.$on '$stateChangeStart', ->
      iscroll.destroy()
      element.removeAttr 'bp-iscroll'
      element.find('bp-iscroll-wrapper').css
        position: 'static'
        transform: ''
        transition: ''

# # Navbar

angular.module('bp.directives').directive 'bpNavbar', deps [
  'bpConfig'
  '$timeout'
  '$compile'
  ], (
  bpConfig
  $timeout
  $compile
  ) ->
  restrict: 'E'
  transclude: true
  template: '<div class="bp-navbar-text" role="heading"></div>'
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->

      options = angular.extend
        noCenter:      if bpConfig.platform is 'android' then yes else no
        noButtonSplit: if bpConfig.platform is 'android' then yes else no
      , bpConfig.navbar or {}

      for key of options
        attr = attrs["bp#{key.charAt(0).toUpperCase()}#{key.slice(1)}"]
        if attr? then options[key] = (if attr is '' then true else attr)

      element.attr
        role: 'navigation'
      transcludeFn scope, (clone) ->
        $navbarText = element.find('.bp-navbar-text')
        placedButtons = 0
        buttons = []

        navbarText = $navbarText.text()
        for child in clone
          $child = angular.element(child)
          if $child.is('bp-button') or $child.is('bp-icon')
            buttons.push($child)
          else if $child.context.nodeName is '#text' or
                  $child.is('span.ng-scope')
            navbarText += ' ' + $child.text().trim()

        # Trim leading and trailing whitespace
        $compile($navbarText.text navbarText.trim()) scope

        if options.noButtonSplit
          for $button in buttons
            if $button.hasClass 'bp-button-back'
              $button.insertBefore $navbarText
            else
              element.append $button.addClass('after')
        else
          for $button, i in buttons
            if (i+1) <= Math.round(buttons.length/2)
              $button
                .addClass('before')
                .insertBefore $navbarText
            else
              element.append $button.addClass('after')

        if not options.noCenter and
           not /^\s*$/.test $navbarText.text() then $timeout ->
          beforeWidth = 0
          afterWidth  = 0
          elem.find('.after').each ->
            afterWidth += $(this).outerWidth()
          elem.find('.before').each ->
            beforeWidth += $(this).outerWidth()

          difference = afterWidth - beforeWidth
          $spacer = $("
            <div style='
              -webkit-box-flex:10;
              max-width:#{Math.abs(difference)}px
            '>")

          if difference > 0
            $spacer.insertBefore $navbarText
          else if difference < 0
            $spacer.insertAfter $navbarText
        , 0

# # Search

angular.module('bp.directives').directive 'bpSearch', deps [
  '$compile'
  '$timeout'
  ], (
  $compile
  $timeout
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    $cancel = $compile(
      '<bp-button bp-tap="cancel()" bp-no-scroll>Cancel</bp-button>'
      ) scope
    $search = element.find 'input'
    element
      .attr('role','search')
      .append $cancel.hide()

    # set input placeholder to "Search" if not already set
    placeholder = $search?.attr 'placeholder'
    if !placeholder? or /^\s*$/.test placeholder
      $search?.attr 'placeholder', 'Search'

    # helper to prevent event default
    preventDefault = (e) ->
      e.preventDefault?()

    $search?.bind 'focus', ->
      # bring in cancel button; shrink input
      padding = (+(element.css 'padding-right').replace('px',''))
      cancelWidth = $cancel.outerWidth()
      inputWidth = element.width() - (padding)
      $search?.css 'width', "#{inputWidth - cancelWidth - padding}px"
      $cancel.show()
      $timeout ->
        element.addClass 'focus'
        scope.$emit 'bpTextDidBeginEditing'
      , 0

      # scroll out UI before search
      if element.prev().length
        element.bind 'touchmove', preventDefault
        $timeout ->
          window.scrollTo 0, element.prev().outerHeight()
        , 0

    # move out cancel button and grow input
    scope.cancel = ->
      if $search?.is ':focus'
        $search.blur()
        scope.$emit 'bpTextDidEndEditing'
      scope.searchTerm = ''
      $search?.css 'width', ''
      element.removeClass 'focus'
      $timeout ->
        $cancel.hide()
      , 500

    $search?.bind 'blur', (e) ->
      # cancel on blur  if no searchterm is present
      if !scope.searchTerm? or /^\s*$/.test scope.searchTerm
        scope.cancel()
      element.unbind 'touchmove', preventDefault

    # prevents blurring the input automatically
    # so we can fire it at the right time i.e. tap/touchend
    $cancel.bind 'touchstart', preventDefault

    scope.$on '$destroy', ->
      $search?.unbind 'focus blur'
      element.unbind 'touchmove', preventDefault
      $cancel.unbind 'touchstart', preventDefault

# # Tabbar

angular.module('bp.directives').directive 'bpTabbar', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'tablist'

# # Tab

angular.module('bp.directives').directive 'bpTab', deps [
  '$state'
  '$timeout'
  ], (
  $state
  $timeout
  )->
  scope: true
  restrict: 'E'
  transclude: true
  template: '<bp-icon></bp-icon>'
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      element.attr
        role: 'tab'

      scope.tabState = attrs.bpState or ''

      # Extract Icon
      $icon = element.find 'bp-icon'
      angular.forEach element.attr('class').split(' '), (value) ->
        if /^bp\-icon\-/.test value
          $icon.addClass value
          element.removeClass value
      # Extract Label
      transcludeFn scope, (clone) ->
        element.append clone

      scope.$on '$stateChangeSuccess', ->
        if $state.includes scope.tabState
          element
            .addClass('bp-tab-active')
            .attr
              'aria-selected': 'true'
        else
          element
            .removeClass('bp-tab-active')
            .attr
              'aria-selected': 'false'

      element.bind 'touchstart', ->
        $timeout ->
          element.trigger 'touchend'
        , 500

      scope.$on '$destroy', ->
        element.unbind 'touchstart'

# # Table-Header

angular.module('bp.directives').directive 'bpTableHeader', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'heading'

# # Table

angular.module('bp.directives').directive 'bpTable', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    role = if element.parents('bp-table').length
      'group'
    else
      'list'
    element.attr {role}

# # Tap

angular.module('bp.directives').directive 'bpTap', deps [
  '$parse'
  'tapService'
  ], (
  $parse
  tapService
  ) ->
  (scope, element, attrs) ->
    tapService.getInstance().setup arguments ...
    element.bind 'tap', (e, touch) ->
      scope.$apply $parse(attrs.bpTap), {$event: e, touch}
      false

# # Config
class BpConfig
  defaultConfig:
    platform: 'ios'

  userConfig:
    noUserConfig: yes

  $get: -> angular.extend @defaultConfig, @userConfig

  setConfig: (config) -> @userConfig = config

angular.module('bp.factories').provider 'bpConfig', BpConfig

# Tap Service

angular.module('bp.services').service 'tapService', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  class TapService
    setup: (scope, element, attrs, customOptions) ->
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
      if $(e.target).attr('bp-tap') and element[0] isnt e.target
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

      if (element.is('bp-button') and element.parent('bp-navbar')) or
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
      e = e.originalEvent
      if e[axis]
        e[axis]
      else if e.changedTouches?[0]?
        e.changedTouches[0][axis]
      else
        0

  getInstance: ->
    new TapService

# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->

  # Initial Transition Values
  direction = 'normal'
  type = ''

  # Detect transition type and direction before states change
  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>

    unless toState.transition or fromState.transition
      return direction = type = ''

    direction = if toParams.direction
      # This is only the case if the user writes the parameter manually
      toParams.direction
    else
      @getDirection fromState, toState

    type = if toParams.transition
      # This is only the case if the user writes the parameter manually
      toParams.transition
    else if fromState.name is ''
      ''
    else if direction is 'reverse'
      fromState.transition
    else
      toState.transition

  # Store last transition so we can clean up before doing the next one
  lastTransition = ''

  # Apply transition to view as class when loaded
  $rootScope.$on '$viewContentLoaded', ->
    if type and direction
      transition = "#{type}-#{direction}"
      angular.element('[ui-view]').each (i, view) ->
        angular.element(view)
          .removeClass(lastTransition)
          .addClass transition
      lastTransition = transition

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'

    if not to and angular.isObject(from) and from.to
      {to, from} = from

    from =  $state.current.url unless from
    return '' if from is '^'

    fromSegments = @_getURISegments from
    toSegments = @_getURISegments to

    if toSegments.length < fromSegments.length
      dir = 'reverse'
      for segment, index in toSegments
        if segment isnt fromSegments[index]
          dir = 'normal'
          break
      dir
    else if toSegments.length is fromSegments.length
      dir = ''

    dir

  # returns array of url segments for url or state (name)
  @_getURISegments = (urlOrState) ->
    url =
      if angular.isString urlOrState
        if urlOrState.charAt(0) is '/'
          urlOrState
        else
          $state.get(urlOrState)?.url
      else if angular.isObject urlOrState
        if urlOrState.url?
          urlOrState.url
        else if urlOrState.name?
          $state.href urlOrState.name

    # remove trailing slashes
    url = url.replace /\/$/, ''

    url.split('/')

  $rootScope.to = (state, stateParams = {}) ->
    $state.transitionTo state, stateParams

  return this
