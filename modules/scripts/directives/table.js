angular.module('bp').directive('bpTable', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var role;
      role = element.parents('bp-table').length ? 'group' : 'list';
      element.attr({
        role: role
      });
    }
  };
});
