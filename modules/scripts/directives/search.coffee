# # Search

angular.module('bp').directive 'bpSearch', deps [
  '$compile'
  '$timeout'
  '$window'
  'Tap'
  ], (
  $compile
  $timeout
  $window
  Tap
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    childScope = scope.$new yes

    # set input placeholder to "Search" if not already set
    childScope.placeholder = $search?.attr 'placeholder'
    if !childScope.placeholder? or /^\s*$/.test childScope.placeholder
      childScope.placeholder = 'Search'

    $bgLeft = angular.element '<bp-search-bg-left>'
    $bgRight = angular.element '<bp-search-bg-right>'
    $placeholder = $compile(
      '<bp-search-placeholder>
        <bp-action class="bp-icon bp-icon-search"></bp-action>
        <span>{{ placeholder }}</span>
      </bp-search-placeholder>') childScope
    $cancel = $compile(
      '<bp-action class="bp-button">Cancel</bp-action>') childScope
    $tapLayer = angular.element '<bp-search-tap>'
    $search = element.find('input').attr
      'required': 'required'
      'type': 'search'

    new Tap childScope, $cancel, {}
    new Tap childScope, $tapLayer, {}

    element
      .attr 'role','search'
      .prepend $bgLeft, $bgRight
      .append $placeholder, $cancel, $tapLayer

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
    childScope.onBlur = (e, extra = {}) ->
      if not $search.val() and not extra.programatic
        $cancel.trigger 'tap'
    childScope.onCancel = ->
      element.removeClass 'focus'
      $search
        .val ''
        .trigger 'input'
        .trigger('blur', programatic: yes)
    childScope.onFocus = ->
      $search.focus()
      $timeout ->
        element.addClass 'focus'
      , 0
    childScope.stopPropagation = (e) ->
      e.stopPropagation()
      e.stopImmediatePropagation()

    angular
      .element $window
      .bind 'resize orientationchange', childScope.onResize

    $search.bind 'blur', childScope.onBlur

    $cancel.bind 'tap', childScope.onCancel

    $tapLayer.bind 'tap', childScope.onFocus

    $tapLayer
      .bind 'click touchstart touchmove touchend', childScope.stopPropagation

    scope.$on '$destroy', ->
      childScope.$destroy()
      angular.element($window).unbind 'resize orientationchange'
      $search.unbind 'blur'
      $cancel.unbind 'tap'
      $tapLayer.unbind 'tap click touchstart touchmove touchend'
