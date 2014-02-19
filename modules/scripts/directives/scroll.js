angular.module('bp').directive('bpScroll', deps([], function() {
  return function(scope, element, attrs) {
    element.bind('touchstart', function() {});
    return scope.$on('$destroy', function() {
      return element.unbind('touchstart');
    });
  };
}));
