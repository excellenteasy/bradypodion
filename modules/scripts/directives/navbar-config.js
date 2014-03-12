/**
@ngdoc directive
@name bp.directive:bpNavbarConfig
@restrict E
@requires bp.directive:bpNavigation
@description `bpNavbarConfig` is a way to configure navbars injected by the {@link bp.directive:bpNavigation `bpNavigation`} directive.
It offers exactly the {@link bp.directive:bpNavbar#usage_parameters same attributes} for configuration as the original navbar, and forwards them to it.
If you put `bpAction`s into the directive they will be moved to the original navbar.
@example
<pre>
<bp-navbar-config bp-navbar-no-up>
  <bp-action class="icon-checkmark">
    Done
  </bp-action>
</bp-navbar-config>
</pre>
*/

angular.module('bp').directive('bpNavbarConfig', function($state) {
  return {
    restrict: 'E',
    require: '^bpNavigation',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs, ctrl) {
        transcludeFn(scope, function(clone) {
          ctrl.registerNavbar(attrs,clone,$state.current,scope)
          element.remove()
        })
      }
    }
  }
})
