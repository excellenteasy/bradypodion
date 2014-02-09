# # Cell

angular.module('bp').directive 'bpCell', ->
  restrict: 'E'
  transclude: true
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        element
          .attr(
            role: 'listitem')
          .append clone
