# # Tap

angular.module('bp').directive 'bpTap', deps [
  '$parse'
  'BpTap'
  ], (
  $parse
  BpTap
  ) ->
  (scope, element, attrs) ->
    new BpTap scope, element, attrs
    element.bind 'tap', (e, touch) ->
      scope.$apply $parse(attrs.bpTap), {$event: e, touch}
      false

    scope.$on '$destroy', ->
      element.unbind 'tap'
