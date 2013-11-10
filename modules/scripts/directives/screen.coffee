# # Screen

angular.module('bp.directives').directive 'bpScreen', deps [], ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.addClass scope.getFullTransition()