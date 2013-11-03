# # Button

angular.module('bp.directives').directive 'bpButton', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'button'
