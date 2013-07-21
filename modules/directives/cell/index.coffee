# # Cell

angular.module('bp.directives').directive 'bpCell', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'listitem'
