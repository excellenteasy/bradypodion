###
  bradypodion body directive
  @since 0.1.0
  @example It will load on any website, so you can define config vars
    <body platform='ios'></body>
  @return [Object<restrict|link>] Angular directive
###
body = (bpConfig) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    scope.config = bpConfig
    latestPlatform = scope.config.platform
    element.addClass scope.platform
    scope.$watch 'config.platform', ->
      element.removeClass latestPlatform
      element.addClass scope.config.platform
      latestPlatform = scope.config.platform

angular.module('bp.directives').directive 'body', body
