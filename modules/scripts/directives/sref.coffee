# # Sref

angular.module('bp').directive 'bpSref', deps [
  '$state'
  '$parse'
  'BpTap'
  ], (
  $state
  $parse
  BpTap
  ) ->
  (scope, element, attrs) ->
    new BpTap scope, element, attrs
    element.bind 'tap', ->
      $state.transitionTo attrs.bpSref
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
