angular.module('bp').directive('bpNavbarConfig', function($state) {
  return {
    restrict: 'E',
    require: '^bpNavigation',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs, ctrl) {
        transcludeFn(scope, function(clone) {
          ctrl.registerNavbar(attrs,clone,$state.current)
          element.remove()
        })
      }
    }
  }
})
