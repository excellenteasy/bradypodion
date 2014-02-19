angular.module('bp').directive('bpCell', function() {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element) {
        transcludeFn(scope, function(clone) {
          element.attr({
            role: 'listitem'
          }).append(clone);
        });
      };
    }
  };
});
