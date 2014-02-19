angular.module('bp').directive('bpApp', deps(['$compile', 'bpConfig', 'bpView'], function($compile, bpConfig, bpView) {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs) {
      bpView.listen();
      return element.addClass(bpConfig.platform).attr({
        role: 'application'
      });
    }
  };
}));
