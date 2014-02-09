# # Action

angular.module('bp').directive 'bpAction', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr 'role', 'button'
