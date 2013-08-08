# # Segmented Control

angular.module('bp.directives').directive 'bpSegmentedControl', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr 'role', 'tablist'

# # Segment

angular.module('bp.directives').directive 'bpSegment', deps [
  '$state'
  ], (
  $state
  ) ->
  restrict: 'E'
  scope: true
  link: (scope, element, attrs) ->
    element.attr
      role: 'tab'

    scope.segmentState = attrs.bpState or ''

    scope.$on '$stateChangeSuccess', ->
      if $state.includes scope.segmentState
        element
          .addClass('bp-segment-active')
          .attr
            'aria-selected': 'true'
      else
        element
          .removeClass('bp-segment-active')
          .attr
            'aria-selected': 'false'
