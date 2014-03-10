/**
@ngdoc directive
@name bp.directive:bpDetailDisclosure
@restrict E
@requires bp.util.bpApp
@example
<pre>
  <bp-cell>
    Cell
    <bp-detail-disclosure></bp-detail-disclosure>
  </bp-cell>
</pre>
@description
`bpDetailDisclosure` is an ios only interface element.
 */

angular.module('bp').directive('bpDetailDisclosure', function(
  bpApp,
  $rootScope) {

  return {
    restrict: 'E',
    link: function(scope, element) {
      var $parent, uniqueId
      if (bpApp.platform === 'android') {
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
