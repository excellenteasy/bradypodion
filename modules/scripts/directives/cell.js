angular.module('bp').directive('bpCell', function() {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs) {
        return transcludeFn(scope, function(clone) {
          return element.attr({
            role: 'listitem'
          }).append(clone);
        });
      };
    }
  };
});
