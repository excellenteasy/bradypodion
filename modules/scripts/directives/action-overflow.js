angular.module('bp').directive('bpActionOverflow', function($window, bpConfig, BpTap) {
  return {
    restrict: 'E',
    transclude: true,
    controller: function($scope, $animate) {
      $scope.open = function($menu) {
        $menu.attr('aria-hidden', 'false')
        $animate.addClass($menu, 'bp-action-overflow-open')
      }
      $scope.close = function($menu) {
        $menu.attr('aria-hidden', 'true')
        $animate.removeClass($menu, 'bp-action-overflow-open')
      }
    },
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs) {
        var open
        if (bpConfig.platform === 'ios') {
          element.attr('aria-hidden', 'true')
        } else {
          element.attr({
            role: 'button',
            'aria-has-popup': 'true'
          })
          new BpTap(scope, element, attrs)
          open = false
          transcludeFn(scope, function(clone) {
            var $$window, $actions, $menu
            $actions = clone.filter('bp-action')
            $actions.each(function() {
              var $action
              $action = angular.element(this)
              $action.attr('role', 'menu-item').addClass('bp-button')
            })
            $menu = angular.element('<bp-action-overflow-menu>').attr({
              role: 'menu',
              'aria-hidden': 'true'
            }).append($actions)
            $$window = angular.element($window)
            element.append($menu)
            element.on('tap', function() {
              if (open) {
                scope.close($menu)
                open = false
              } else {
                scope.open($menu)
                open = true
              }
            })
            $actions.on('touchstart', function(e) {
              e.stopPropagation()
            })
            $$window.on('touchstart', function() {
              if (open) {
                scope.close($menu)
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
