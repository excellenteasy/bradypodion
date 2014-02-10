# # Tap

angular.module('bp').directive 'bpTap', deps [
  '$parse'
  'Tap'
  ], (
  $parse
  Tap
  ) ->
  (scope, element, attrs) ->
    new Tap arguments ...
    element.bind 'tap', (e, touch) ->
      scope.$apply $parse(attrs.bpTap), {$event: e, touch}
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
