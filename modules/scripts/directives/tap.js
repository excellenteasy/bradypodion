angular.module('bp').directive('bpTap', deps(['$parse', 'BpTap'], function($parse, BpTap) {
  return function(scope, element, attrs) {
    new BpTap(scope, element, attrs);
    element.bind('tap', function(e, touch) {
      scope.$apply($parse(attrs.bpTap), {
        $event: e,
        touch: touch
      });
      return false;
    });
    return scope.$on('$destroy', function() {
      return element.unbind('tap');
    });
  };
}));
