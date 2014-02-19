angular.module('bp').directive('bpScroll', function() {
  return function(scope, element, attrs) {
    element.bind('touchstart', function() {});
    return scope.$on('$destroy', function() {
      return element.unbind('touchstart');
    });
  };
});
