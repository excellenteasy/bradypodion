angular.module('bp').directive('bpAction', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      element.attr('role', 'button');
    }
  };
});
