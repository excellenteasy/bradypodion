# # Action

angular.module('bp.directives').directive 'bpAction', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr 'role', 'button'
