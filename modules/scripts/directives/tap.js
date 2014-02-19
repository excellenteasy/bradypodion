angular.module('bp').directive('bpTap', function($parse, BpTap) {
  return function(scope, element, attrs) {
    new BpTap(scope, element, attrs);
    element.bind('tap', function(e, touch) {
      scope.$apply($parse(attrs.bpTap), {
        $event: e,
        touch: touch
      });
      return false;
    });
    scope.$on('$destroy', function() {
      element.unbind('tap');
    });
  };
});
