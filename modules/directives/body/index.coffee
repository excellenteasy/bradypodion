# # Body

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
