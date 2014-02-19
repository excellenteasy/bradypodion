angular.module('bp').directive('bpIscroll', deps(['bpConfig', '$timeout'], function(bpConfig, $timeout) {
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
      return $scope.setIScroll = function(inIscroll, inSticky) {
        iscroll = inIscroll;
        return iscrollsticky = inSticky;
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
        return scope.setIScroll(isc, iscs);
      }, 0);
      return element.on('$destroy', function() {
        return scope.getIScroll().destroy();
      });
    }
  };
}));
