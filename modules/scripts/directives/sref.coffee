# # Sref

angular.module('bp').directive 'bpSref', deps [
  '$state'
  '$parse'
  'tapService'
  ], (
  $state
  $parse
  tapService
  ) ->
  (scope, element, attrs) ->
    tapService.getInstance().setup arguments ...
    element.bind 'tap', ->
      $state.transitionTo attrs.bpSref
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
