###
  bradypodion button directive
  @since 0.1.0
  @example Simple button with title
    <bp-button title="test"></bp-button>
  @return [Object<restrict|template|link>] Angular directive
###
button = ->
  restrict: 'E'
  transclude: true
  template: ''
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        element.append clone

angular.module('bp.directives').directive 'bpButton', button
