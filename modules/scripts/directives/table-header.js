angular.module('bp').directive('bpTableHeader', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      element.attr({
        role: 'heading'
      });
    }
  };
});
