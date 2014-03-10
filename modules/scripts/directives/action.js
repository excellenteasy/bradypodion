/**
@ngdoc directive
@name bp.directive:bpAction
@restrict E
@param {string} class Add either the `bp-button` or `bp-icon` class to an action element.
@description
`bpAction` is a general type of interface element that is mainly used within `bpNavbar`.
It supports `bpButton` and `bpIcon` types.
The abstraction is necessary as in some occasions an action is an icon on android, while it's a button on ios.
This is described in more detail in the {@link bp.directive:bpNavbar `bpNavbar`} documentation.
 */

angular.module('bp').directive('bpAction', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.attr('role', 'button')
    }
  }
})
