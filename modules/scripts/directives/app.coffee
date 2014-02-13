# # Body

angular.module('bp').directive 'bpApp', deps [
  '$compile'
  'bpConfig'
  'bpView'
  ], (
  $compile
  bpConfig
  bpView
  ) ->
  restrict: 'AE'
  link: (scope, element, attrs) ->
    bpView.listen()
    element
      .addClass(bpConfig.platform)
      .attr
        role: 'application'
