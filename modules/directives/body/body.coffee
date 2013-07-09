###
  bradypodion body directive
  @since 0.1.0
  @example It will load on any website, so you can define config vars
    <body platform='ios'></body>
  @return [Object<restrict|link>] Angular directive
###
body = ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    scope.platform = attrs.platform or 'ios'

angular.module('bp.directives').directive 'body', body
