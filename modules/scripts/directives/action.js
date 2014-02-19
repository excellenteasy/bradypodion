angular.module('bp').directive('bpAction', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      return element.attr('role', 'button');
    }
  };
});
