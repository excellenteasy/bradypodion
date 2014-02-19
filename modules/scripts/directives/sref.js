angular.module('bp').directive('bpSref', function($state, $parse, BpTap) {
  return function(scope, element, attrs) {
    new BpTap(scope, element, attrs);
    element.bind('tap', function() {
      $state.transitionTo(attrs.bpSref);
      return false;
    });
    return scope.$on('$destroy', function() {
      return element.unbind('tap');
    });
  };
});
