# # Tabbar

angular.module('bp').directive 'bpTabbar', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'tablist'

# # Tab

angular.module('bp').directive 'bpTab', deps [
  '$state'
  '$compile'
  '$timeout'
  ], (
  $state
  $compile
  $timeout
  )->
  restrict: 'E'
  scope:
    bpSref: '@'
    bpTabIcon: '@'
    bpTabTitle: '@'
  link: (scope, element, attrs) ->
    element.attr
      role: 'tab'

    state = $state.get scope.bpSref
    unless attrs.bpTabTitle?
      attrs.bpTabTitle =
        state.data?.title or
        state.name?.charAt(0).toUpperCase() + state.name?.slice 1

    $icon = $compile("
      <span class='bp-icon {{bpTabIcon}}'></span>") scope

    $title = $compile("
      <span>{{
        bpTabTitle
      }}</span>") scope

    element.append $icon, $title

    scope.$on '$stateChangeSuccess', ->
      if $state.includes scope.bpSref
        element
          .addClass 'bp-tab-active'
          .attr 'aria-selected', 'true'
      else
        element
          .removeClass 'bp-tab-active'
          .attr 'aria-selected', 'false'

    element.bind 'touchstart', ->
      $timeout ->
        element.trigger 'touchend'
      , 500

    scope.$on '$destroy', ->
      element.unbind 'touchstart'
