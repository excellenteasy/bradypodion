angular.module('bp').directive('bpScroll', function() {
  return function(scope, element) {
    element.bind('touchstart', function() {});
    scope.$on('$destroy', function() {
      element.unbind('touchstart');
    });
  };
});
