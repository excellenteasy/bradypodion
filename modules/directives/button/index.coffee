# # Button

angular.module('bp.directives').directive 'bpButton', ->
  restrict: 'E'
  transclude: true
  template: ''
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      element.attr
        role: 'button'
      transcludeFn scope, (clone) ->
        element.append clone
