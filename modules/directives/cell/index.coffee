###
  bradypodion cell directive
  @since 0.1.0
  @example description of cell example
    <bp-cell></bp-cell>
  @return [Object<restrict|template|link>] Angular directive
###
cell = ->
  restrict: 'E'
  transclude: true
  template: ''
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        element.append clone

angular.module('bp.directives').directive 'bpCell', cell
