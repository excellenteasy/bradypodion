# # Detail Disclosure

angular.module('bp.directives').directive 'bpDetailDisclosure', deps [
  'bpConfig'
  ], (
  bpConfig
  ) ->
  restrict: 'E'
  link: (scope, element, attrs) ->
    if bpConfig.platform is 'android'
      element.attr 'aria-hidden', 'true'
    else
      $parent = element.parent()

      unless uniqueId = $parent.attr 'id'
        uniqueId = _.uniqueId 'bp_'
        $parent.attr 'id', uniqueId

      element.attr
        'aria-describedby': uniqueId
        'aria-label': 'More Info'
        role: 'button'
