/**
@ngdoc directive
@name bp.directive:bpScroll
@param {boolean} bpScrollSticky Enables sticky headers for `ios`.
@example
<pre>
<bp-table bp-scroll bp-scroll-sticky>
  <div>
    <bp-table-header>A</bp-table-header>
    <bp-cell>Aa</bp-cell>
    <bp-cell>Aa</bp-cell>
    <bp-cell>Aa</bp-cell>
    <bp-cell>Aa</bp-cell>
    <bp-cell>Aa</bp-cell>
  </div>
</bp-table>
</pre>
@description Makes the content within the directive scrollable via CSS.
*/

angular.module('bp').directive('bpScroll', function() {
  return function(scope, element) {
    element.bind('touchstart', angular.noop)
    scope.$on('$destroy', function() {
      element.unbind('touchstart')
    })
  }
})
