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
