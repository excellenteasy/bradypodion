# # Table-Header

angular.module('bp.directives').directive 'bpTableHeader', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'heading'
