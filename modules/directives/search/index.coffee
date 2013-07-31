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
