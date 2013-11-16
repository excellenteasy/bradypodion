# # Tap

angular.module('bp.directives').directive 'bpTap', deps [
  '$parse'
  'tapService'
  ], (
  $parse
  tapService
  ) ->
  (scope, element, attrs) ->
    tapService.getInstance().setup arguments ...
    element.bind 'tap', (e, touch) ->
      scope.$apply $parse(attrs.bpTap), {$event: e, touch}
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
