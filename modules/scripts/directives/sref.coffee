# # Sref

angular.module('bp').directive 'bpSref', deps [
  '$state'
  '$parse'
  'Tap'
  ], (
  $state
  $parse
  Tap
  ) ->
  (scope, element, attrs) ->
    new Tap scope, element, attrs
    element.bind 'tap', ->
      $state.transitionTo attrs.bpSref
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
