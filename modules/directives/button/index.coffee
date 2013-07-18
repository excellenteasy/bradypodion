# # Button

button = ->
  restrict: 'E'
  transclude: true
  template: ''
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        element.append clone

angular.module('bp.directives').directive 'bpButton', button
