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
    link: function(scope, element, attrs) {
      if (bpApp.platform === 'android') {
        element.attr('aria-hidden', 'true')
        return
      }

      var uniqueId = attrs.ariaDescribedby
      if (!uniqueId) {
        var $parent = element.parent()
        if (!(uniqueId = $parent.attr('id'))) {
          if (angular.isUndefined($rootScope._uniqueId)) {
            $rootScope._uniqueId = 0
          }
          uniqueId = 'bp_' + $rootScope._uniqueId++
          $parent.attr('id', uniqueId)
        }
      }

      element.attr({
        'aria-describedby': uniqueId,
        'aria-label': attrs.ariaLabel || 'More Info',
        role: attrs.role || 'button'
      })
    }
  }
})
