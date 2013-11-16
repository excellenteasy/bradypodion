# # Scroll

angular.module('bp.directives').directive 'bpScroll', deps [], ->
  (scope, element, attrs) ->
    # http://stackoverflow.com/a/18737266/1849359
    element.bind 'touchstart', ->

    scope.$on '$destroy', ->
      element.unbind 'touchstart'
