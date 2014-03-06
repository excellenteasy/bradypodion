angular.module('bp').directive('bpSref', function($state, $parse, BpTap, bpView) {
  return function(scope, element, attrs) {
    var ref = bpView.parseState(attrs.bpSref, scope)
    new BpTap(scope, element, attrs)
    element.bind('tap', function() {
      $state.go(ref.state,ref.params)
      return false
    })
    scope.$on('$destroy', function() {
      element.unbind('tap')
    })
  }
})
