/**
@ngdoc directive
@name bp.directive:bpTableHeader
@restrict E
@description `bpTableHeader` is used as a header element withing {@link bp.directive:bpTable `bpTable`}s.
If you enable either `bpScrollSticky` or `bpIscrollSticky` it's the default element to stick to the top.
 */

angular.module('bp').directive('bpTableHeader', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      if (!attrs.role) {
        element.attr('role', 'heading')
      }
    }
  }
})
