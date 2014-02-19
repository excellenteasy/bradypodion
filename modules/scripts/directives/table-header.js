angular.module('bp').directive('bpTableHeader', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      return element.attr({
        role: 'heading'
      });
    }
  };
});
