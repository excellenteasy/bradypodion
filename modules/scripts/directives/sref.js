angular.module('bp').directive('bpSref', function($state, $parse, bpTap, bpView) {
  return function(scope, element, attrs) {
    var ref = bpView.parseState(attrs.bpSref, scope)
    var tap = bpTap(element, attrs)
    element.bind('tap', function() {
      $state.go(ref.state,ref.params)
      return false
    })
    scope.$on('$destroy', function() {
      tap.disable()
    })
  }
})
