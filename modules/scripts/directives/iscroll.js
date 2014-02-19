angular.module('bp').directive('bpIscroll', function(bpConfig, $timeout) {
  return {
    transclude: true,
    template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
    controller: function($scope) {
      var iscroll, iscrollsticky;
      iscroll = null;
      iscrollsticky = null;
      $scope.getIScroll = function() {
        return iscroll;
      };
      $scope.getIScrollSticky = function() {
        return iscrollsticky;
      };
      $scope.setIScroll = function(inIscroll, inSticky) {
        iscroll = inIscroll;
        iscrollsticky = inSticky;
      };
    },
    link: function(scope, element, attrs) {
      var options;
      options = angular.extend({
        probeType: 3,
        scrollbars: true
      }, bpConfig.iscroll);
      $timeout(function() {
        var isc, iscs, selector;
        isc = new IScroll(element.get(0), options);
        if ((attrs.bpIscrollSticky != null) && bpConfig.platform !== 'android') {
          selector = attrs.bpIscrollSticky || 'bp-table-header';
          iscs = new IScrollSticky(isc, selector);
        }
        scope.setIScroll(isc, iscs);
      }, 0);
      element.on('$destroy', function() {
        scope.getIScroll().destroy();
      });
    }
  };
});
