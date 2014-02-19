angular.module('bp').directive('bpScroll', function() {
  return function(scope, element, attrs) {
    element.bind('touchstart', function() {});
    scope.$on('$destroy', function() {
      element.unbind('touchstart');
    });
  };
});
