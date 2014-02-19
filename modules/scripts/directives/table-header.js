angular.module('bp').directive('bpTableHeader', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.attr({
        role: 'heading'
      });
    }
  };
});
