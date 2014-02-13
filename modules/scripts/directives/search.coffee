# # Search

angular.module('bp').directive 'bpSearch', deps [
  '$compile'
  '$timeout'
  '$window'
  'Tap'
  'bpConfig'
  ], (
  $compile
  $timeout
  $window
  Tap
  bpConfig
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    ios = bpConfig.platform is 'ios'
    childScope = scope.$new yes

    if ios
      $bgLeft = angular.element '<bp-search-bg-left>'
      $bgRight = angular.element '<bp-search-bg-right>'
      $cancel = $compile(
        '<bp-action class="bp-button">Cancel</bp-action>') childScope

    $placeholder = $compile(
      '<bp-search-placeholder>
        <bp-action class="bp-icon bp-icon-search"></bp-action>
        <span>{{ placeholder }}</span>
      </bp-search-placeholder>') childScope
    $tapLayer = angular.element '<bp-search-tap>'
    $search = element.find('input').attr
      'required': 'required'
      'type': 'search'

    # set input placeholder to "Search" if not already set
    childScope.placeholder = $search.attr 'placeholder'
    unless childScope.placeholder?
      childScope.placeholder = 'Search'

    new Tap childScope, $cancel, {} if ios
    new Tap childScope, $tapLayer, {}

    element
      .attr 'role','search'
      .prepend $bgLeft, $bgRight
      .append $placeholder, $cancel, $tapLayer

    if ios
      cancelWidth = null
      $timeout ->
        width = element.outerWidth()
        cancelWidth = $cancel.outerWidth()
        iconWidth = $placeholder.find('.bp-icon').outerWidth()
        inputWidth = width - cancelWidth - 6
        $bgLeft.css 'width', inputWidth
        $bgRight.css 'width', cancelWidth
        $search.css
          'width': inputWidth
          'padding-left': 1.5 * iconWidth
      , 50 # have to wait a bit for the icon font to load

      childScope.onResize = ->
        inputWidth = element.outerWidth() - cancelWidth
        $bgLeft.css 'width', inputWidth
      childScope.onCancel = ->
        element.removeClass 'focus'
        $search
          .val ''
          .trigger 'input'
          .trigger('blur', programatic: yes)

    childScope.onBlur = (e, extra = {}) ->
      if not ios
        element.removeClass 'focus'
      else if not $search.val() and not extra.programatic
        $cancel.trigger 'tap'
    childScope.onFocus = ->
      $search.focus()
      $timeout ->
        element.addClass 'focus'
      , 0
    childScope.stopPropagation = (e) ->
      e.stopPropagation()
      e.stopImmediatePropagation()

    if ios
      angular
        .element $window
        .bind 'resize orientationchange', childScope.onResize

      $cancel.bind 'tap', childScope.onCancel

    $search.bind 'blur', childScope.onBlur

    $tapLayer.bind 'tap', childScope.onFocus

    $tapLayer
      .bind 'click touchstart touchmove touchend', childScope.stopPropagation

    scope.$on '$destroy', ->
      childScope.$destroy()
      if ios
        angular.element($window).unbind 'resize orientationchange'
        $cancel.unbind 'tap'
      $search.unbind 'blur'
      $tapLayer.unbind 'tap click touchstart touchmove touchend'
