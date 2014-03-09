angular.module('bp').directive('bpTap', function($parse, bpTap) {
  return function(scope, element, attrs) {
    var tap = bpTap(element, attrs)
    element.bind('tap', function(e, touch) {
      scope.$apply($parse(attrs.bpTap), {
        $event: e,
        touch: touch
      })
      return false
    })
    scope.$on('$destroy', function() {
      tap.disable()
    })
  }
})
