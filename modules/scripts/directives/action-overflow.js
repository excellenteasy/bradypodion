angular.module('bp').directive('bpActionOverflow', function(
  $window,
  bpApp,
  BpTap) {

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
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs, ctrl) {
        if (bpApp.platform === 'ios') {
          element.attr('aria-hidden', 'true')
        } else {
          element.attr({
            role: 'button',
            'aria-has-popup': 'true'
          })

          new BpTap(scope, element, attrs)
          var open = false

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
            element.on('tap', function() {
              if (open) {
                ctrl.close($menu)
                open = false
              } else {
                ctrl.open($menu)
                open = true
              }
            })
            $actions.on('touchstart', function(e) {
              e.stopPropagation()
            })
            $$window.on('touchstart', function() {
              if (open) {
                ctrl.close($menu)
                open = false
                element.trigger('touchcancel')
              }
            })
            scope.$on('$destroy', function() {
              element.unbind('tap')
              $actions.unbind('touchstart')
              $$window.unbind('touchstart')
            })
          })
        }
      }
    }
  }
})
