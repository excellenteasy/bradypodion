angular.module('bp').directive('bpIscroll', function(bpConfig, $timeout) {
  return {
    transclude: true,
    template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
    controller: function($scope) {
      var iscroll, iscrollsticky
      iscroll = null
      iscrollsticky = null
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
      var options
      options = angular.extend({
        probeType: 3,
        scrollbars: true
      }, bpConfig.iscroll)
      $timeout(function() {
        var iscs
        var isc = new IScroll(element.get(0), options)
        if ((attrs.bpIscrollSticky != null) &&
          bpConfig.platform !== 'android') {

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
