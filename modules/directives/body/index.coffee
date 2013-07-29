# # Body

angular.module('bp.directives').directive 'body', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    scope.config = bpConfig
    latestPlatform = scope.config.platform
    element
      .addClass(scope.config.platform)
      .attr
        role: 'application'
