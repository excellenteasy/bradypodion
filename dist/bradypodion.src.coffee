'use strict'
###!
 * Bradypodion – an AngularJS directive library written in CoffeeScript used to build maintainable mobile web apps that don't suck.
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
  angular.module (namespaced = "bp.#{module}"), inject
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps

# # Flip

flip = (dir = 'normal', name = 'flip', duration = 500) ->
  sign = if dir is 'normal' then '' else '-'

  angular.module('bp.animations').animation "#{name}-#{dir}-enter", deps [
    '$timeout'
    ], (
    $timeout
    ) ->
    setup: (element) ->
      view    = element.parent('[ui-view]')
        .addClass('flip-normal-view')
        .css
          transition: "all #{duration/2000}s ease-in"
          transform:  'translate3d(0,0,0) rotateY(0deg)'
      wrapper = view.parent().addClass 'flip-normal-wrapper'
      { view, wrapper }

    start: (element, done, elements) ->
      width = elements.view.outerWidth()
      elements.view.css
        transform: "translate3d(0,0,-#{width}px) rotateY(#{sign}90deg)"
      $timeout ->
        elements.view.css
          transition: "all #{duration/2000}s ease-out"
          transform:  "translate3d(0,0,0) rotateY(#{sign}180deg)"

      , duration/2
      $timeout ->
        elements.view
          .removeClass('flip-normal-view')
          .css
            transition: ''
            transform: ''
        elements.wrapper.removeClass 'flip-normal-wrapper'
        done()
      , duration

  angular.module('bp.animations').animation "#{name}-#{dir}-leave", deps [
    '$timeout'
    ], (
    $timeout
    ) ->
    start: (e, done) ->
      $timeout done, duration

flip()
flip 'reverse'

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
    element.attr
      role: 'button'

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
    element.attr
      role: 'list'

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
    if element.is('bp-button') and element.parent('bp-navbar')
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
        element.addClass options.activeClass
        touch.ongoing = on
        if options.noScroll
          e.preventDefault()
      else
        touch.ongoing = no
        element.removeClass options.activeClass

    element.bind 'touchend touchcancel', (e) ->
      if touch.ongoing and e.type is 'touchend'
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

# # Config

angular.module('bp.factories').provider 'bpConfig', ->
  @defaultConfig =
    platform: 'ios'
  @userConfig =
    noUserConfig: yes

  @$get = -> angular.extend @defaultConfig, @userConfig

  @setConfig = (config) -> @userConfig = config

# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->
  direction = 'normal'
  transition = ''

  @to = (state, stateParams = {}) ->
    $state.transitionTo state, stateParams

  # returns array of url segments for url or state (name)
  @_getURISegmentsFrom = (urlOrState) ->
    url =
      if angular.isString urlOrState
        if urlOrState.charAt(0) is '/'
          urlOrState
        else
          $state.getOptionsOfState(urlOrState)?.url
      else if angular.isObject urlOrState
        if urlOrState.url?
          urlOrState.url
        else if urlOrState.name?
          $state.href urlOrState.name

    # remove trailing slashes
    url = url.replace /\/$/, ''

    url.split('/')

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'


    if not to and angular.isObject(from) and from.to
      {to, from} = from

    from =  $state.current.url unless from
    return 'none' if from is '^'

    fromURI = @_getURISegmentsFrom from
    toURI = @_getURISegmentsFrom to

    if toURI.length < fromURI.length
      dir = 'reverse'
      for segment, index in toURI
        if segment isnt fromURI[index]
          dir = 'normal'
          break
      dir
    else if toURI.length is fromURI.length
      dir = 'none'
    dir

  @getFullTransition = -> "#{transition}-#{direction}"

  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>

    unless toState.transition and fromState.transition
      return ''

    if toParams.direction
      {direction} = toParams
    else
      direction = @getDirection fromState, toState

    transition =
      if toParams.transition
        toParams.transition
      else if fromState.name is ''
        ''
      else if direction is 'reverse'
        fromState.transition
      else
        toState.transition

  angular.extend $rootScope, this
