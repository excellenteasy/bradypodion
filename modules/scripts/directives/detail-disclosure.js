angular.module('bp').directive('bpDetailDisclosure', function(
  bpConfig,
  $rootScope) {

  return {
    restrict: 'E',
    link: function(scope, element) {
      var $parent, uniqueId
      if (bpConfig.platform === 'android') {
        element.attr('aria-hidden', 'true')
      } else {
        $parent = element.parent()
        if (!(uniqueId = $parent.attr('id'))) {
          if ($rootScope._uniqueId == null) {
            $rootScope._uniqueId = 0
          }
          uniqueId = 'bp_' + $rootScope._uniqueId++
          $parent.attr('id', uniqueId)
        }
        element.attr({
          'aria-describedby': uniqueId,
          'aria-label': 'More Info',
          role: 'button'
        })
      }
    }
  }
})
