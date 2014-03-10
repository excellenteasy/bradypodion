/**
@ngdoc directive
@name bp.directive:bpToolbar
@restrict E
@requires bp.util.bpApp
@example
<pre>
<bp-toolbar>
  <bp-action bp-tap="doSomething()" class="icon-bookmark">First</bp-action>
  <bp-action bp-tap="doSomething()" class="icon-comment">Second</bp-action>
  <bp-action bp-tap="doSomething()" class="icon-download">Third</bp-action>
  <bp-action bp-tap="doSomething()" class="icon-inbox">Fourth</bp-action>
  <bp-action bp-tap="doSomething()" class="icon-music">Fifth</bp-action>
</bp-toolbar>
</pre>
@description
If there is no more space to display `bpAction`s within a `bpNavbar` on ios a toolbar is created.
Normally you won't create it by yourself, but it will be created for you by the navbar.
This is described in more detail in the {@link bp.directive:bpNavbar `bpNavbar`} documentation.

<div class="alert alert-info">
  {@link bp.directive:bpActionOverflow `bpActionOverflow`} is the android equivalent of `bpToolbar`.
</div>
 */

angular.module('bp').directive('bpToolbar', function(bpApp) {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element) {
        if (bpApp.platform === 'android') {
          element.attr('aria-hidden', 'true')
        } else {
          element.attr({
            role: 'toolbar'
          })
          transcludeFn(scope, function(clone) {
            var $actions
            $actions = clone.filter('bp-action')
            $actions.each(function() {
              var $action = angular.element(this)
              $action
                .attr('aria-label', $action.text())
                .text('')
                .removeClass('bp-button')
                .addClass('bp-icon')
            })
            element.append($actions)
          })
        }
      }
    }
  }
})
