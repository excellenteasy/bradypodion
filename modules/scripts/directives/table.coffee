# # Table

angular.module('bp.directives').directive 'bpTable', ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    role = if element.parents('bp-table').length
      'group'
    else
      'list'
    element.attr {role}
