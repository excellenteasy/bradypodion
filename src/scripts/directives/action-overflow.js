/**
@ngdoc directive
@name bp.directive:bpActionOverflow
@restrict E
@requires bp.util.bpApp
@example
<pre>
<bp-action-overflow>
  <bp-action ng-click="doSomething()">First</bp-action>
  <bp-action ng-click="doSomething()">Second</bp-action>
  <bp-action ng-click="doSomething()">Third</bp-action>
  <bp-action ng-click="doSomething()">Fourth</bp-action>
  <bp-action ng-click="doSomething()">Fifth</bp-action>
</bp-action-overflow>
</pre>
@description
If there is no more space to display `bpAction`s within a `bpNavbar` on android this menu is created.
Normally you won't create it by yourself, but it will be created for you by the navbar.
This is described in more detail in the {@link bp.directive:bpNavbar `bpNavbar`} documentation.

<div class="alert alert-info">
  {@link bp.directive:bpToolbar `bpToolbar`} is the ios equivalent of `bpActionOverflow`.
</div>
 */

angular.module('bp').directive('bpActionOverflow', function(
  $window,
  bpApp) {

  return {
    restrict: 'E',
    transclude: true,
    controller: function($animate) {
      this.open = function($menu) {
        $menu.attr('aria-hidden', 'false')
        $animate.addClass($menu, 'bp-action-overflow-open')
      }
      this.close = function($menu) {
        $menu.attr('aria-hidden', 'true')
        $animate.removeClass($menu, 'bp-action-overflow-open')
      }
    },
    replace: true,
    template: '<bp-action-overflow-wrapper ng-click></bp-action-overflow-wrapper>',
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs, ctrl) {
        if (bpApp.platform === 'ios') {
          element.attr('aria-hidden', 'true')
          return
        }

        element.attr({
          role: attrs.role || 'button',
          'aria-has-popup': 'true'
        })

        var open = false
        var dismiss = false

        transcludeFn(scope, function(clone) {
          var $actions = clone.filter('bp-action')
          $actions.each(function() {
            var $action = angular.element(this)
            $action
              .attr('role', 'menu-item')
              .addClass('bp-button')
          })
          var $menu = angular.element('<bp-action-overflow-menu>')
            .attr({
              role: 'menu',
              'aria-hidden': 'true'
            }).append($actions)

          var $$window = angular.element($window)
          element.append($menu)

          element.on('click', function() {
            if (open) {
              ctrl.close($menu)
              open = false
            }
            if (!dismiss) {
              ctrl.open($menu)
              open = true
            }
            dismiss = false
          })

          $actions.on('touchstart mousedown click', function(e) {
            e.stopPropagation()
          })

          $$window.on('touchstart mousedown', function(e) {
            if (open) {
              ctrl.close($menu)
              open = false
              if (element.is(e.target) || $menu.is(e.target)) {
                dismiss = true
              }
            }
          })

          scope.$on('$destroy', function() {
            element.unbind('click')
            $actions.unbind('touchstart mousedown click')
            $$window.unbind('touchstart mousedown')
          })
        })
      }
    }
  }
})
