# # Table-Header

angular.module('bp').directive 'bpTableHeader', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'heading'
