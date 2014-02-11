# # Body

angular.module('bp').directive 'bpApp', deps [
  '$compile'
  'bpConfig'
  'bpViewService'
  ], (
  $compile
  bpConfig
  bpViewService
  ) ->
  restrict: 'AE'
  link: (scope, element, attrs) ->
    bpViewService.listen()
    element
      .addClass(bpConfig.platform)
      .attr
        role: 'application'
