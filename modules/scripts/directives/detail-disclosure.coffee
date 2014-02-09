# # Detail Disclosure

angular.module('bp').directive 'bpDetailDisclosure', deps [
  'bpConfig'
  '$rootScope'
  ], (
  bpConfig
  $rootScope
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    if bpConfig.platform is 'android'
      element.attr 'aria-hidden', 'true'
    else
      $parent = element.parent()

      unless uniqueId = $parent.attr 'id'
        unless $rootScope._uniqueId? then $rootScope._uniqueId = 0
        uniqueId = 'bp_' + $rootScope._uniqueId++
        $parent.attr 'id', uniqueId

      element.attr
        'aria-describedby': uniqueId
        'aria-label': 'More Info'
        role: 'button'
