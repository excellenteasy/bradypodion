angular.module('bp').directive('bpApp', function($compile, bpConfig, bpView) {
  return {
    restrict: 'AE',
    link: function(scope, element) {
      bpView.listen()
      element.addClass(bpConfig.platform).attr({
        role: 'application'
      })
    }
  }
})
