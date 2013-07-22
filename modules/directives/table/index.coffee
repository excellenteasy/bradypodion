# # Table

angular.module('bp.directives').directive 'bpTable', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    element.attr
      role: 'list'
