angular.module('bp').directive('bpAction', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.attr('role', 'button');
    }
  };
});
