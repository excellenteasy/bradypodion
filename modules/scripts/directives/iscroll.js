/**
@ngdoc overview
@name bp.iscroll
@example
<pre>
<script src="iscroll-probe.js"></script>
<script src="iscroll-sticky.js"></script>
...
<script src="bradypodion.js"></script>
<script src="bradypodion-iscroll.js"></script>
</pre>
@description
# The `bp.iscroll` module

`bp.iscroll` is a separate module that you need to embed in your application.
It wraps [iScroll](http://iscrolljs.com/) so you can easily use it in your views.

*/

/**
@ngdoc directive
@name bp.iscroll.directive:bpIscroll
@requires bp.util.bpApp
@param {string=} bpIscrollSticky Enables sticky headers for `ios`.
You can define the CSS Selector that is used to determine what a header is (`bp-table-header`).
@example
<pre>
<bp-table bp-iscroll bp-iscroll-sticky>
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
@description Makes the content within the directive scrollable via [iScroll](http://iscrolljs.com).
*/

angular.module('bp.iscroll', ['bp']).directive('bpIscroll', function(bpApp, $timeout) {
  return {
    transclude: true,
    template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
    controller: function($scope) {
      var iscroll, iscrollsticky

      $scope.getIScroll = function() {
        return iscroll
      }

      $scope.getIScrollSticky = function() {
        return iscrollsticky
      }

      this.setIScroll = function(inIscroll, inSticky) {
        iscroll = inIscroll
        iscrollsticky = inSticky
      }
    },
    link: function(scope, element, attrs, ctrl) {
      var options = angular.extend({
        probeType: 3,
        scrollbars: true
      }, bpApp.iscroll)

      $timeout(function() {
        var iscs
        var isc = new IScroll(element.get(0), options)
        if ((angular.isDefined(attrs.bpIscrollSticky)) &&
          bpApp.platform !== 'android') {

          var selector = attrs.bpIscrollSticky || 'bp-table-header'
          iscs = new IScrollSticky(isc, selector)
        }
        ctrl.setIScroll(isc, iscs)
      }, 0, false)

      element.on('$destroy', function() {
        scope.getIScroll().destroy()
      })
    }
  }
})
