angular.module('bp')
  .directive('bpNavbar', function(bpConfig, $timeout, $state, $compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      bpNavbarTitle: '@'
    },
    controller: function($scope) {
      $scope.getTitleFromState = function(state) {
        if (angular.isObject(state.data) &&
          angular.isString(state.data.title)) {

          return state.data.title
        } else {
          return state.name.charAt(0).toUpperCase() + state.name.slice(1)
        }
      }
      return $scope.convertActionToIcon = function($action) {
        if (angular.isElement($action)) {
          $action
            .attr('aria-label', $action.text())
            .text('')
            .removeClass('bp-button')
            .addClass('bp-icon')
        }
      }
    },
    compile: function(elem, attrs, transcludeFn) {
      var ios = bpConfig.platform === 'android' ? false : true

      return function(scope, element, attrs) {
        var state = $state.current
        element.attr('role', 'navigation')

        transcludeFn(scope, function(clone) {
          var $arrow, $frstAction, $scndAction, $toolbar, $up

          if (angular.isUndefined(attrs.bpNavbarTitle)) {
            attrs.bpNavbarTitle = scope.getTitleFromState(state)
          }

          var $title = $compile(angular.element('<bp-navbar-title>')
            .attr({
              role: 'heading',
              'ng-bind': 'bpNavbarTitle'
            }))(scope)

          var $actions = clone.filter('bp-action')

          if (angular.isObject(state.data) &&
            angular.isString(state.data.up) &&
            !angular.isDefined(attrs.bpNavbarNoUp)) {

            var upState = $state.get(state.data.up)
            var upTitle = scope.getTitleFromState(upState)
            $arrow = angular.element('<bp-button-up>')
            $up = $compile(angular.element('<bp-action>')
              .addClass('bp-action-up')
              .attr('bp-sref', upState.name)
              .text(upTitle))(scope)
          }

          if (ios) {
            if ($actions.length > 2) {
              $frstAction = $up.addClass('bp-button')
              $actions.each(function() {
                scope.convertActionToIcon(angular.element(this))
              })
              $toolbar = angular.element('<bp-toolbar>').append($actions)
            } else {
              if (angular.isElement($up)) {
                $actions = $up.add($actions)
              }
              $frstAction = $actions.eq(0)
              $scndAction = $actions.eq(1)

              $actions.each(function() {
                var $action = angular.element(this)
                if ($action.hasClass('bp-icon')) {
                  scope.convertActionToIcon($action)
                } else {
                  $action.addClass('bp-button')
                }
              })
            }

            element
              .append($frstAction, $title, $scndAction, $arrow)
              .after($toolbar)

            if (!scope.navbarTitle) {
              $timeout(function() {
                var frstW = angular.isElement($scndAction) ? $scndAction.outerWidth() : 0
                var scndW = angular.isElement($frstAction) ? $frstAction.outerWidth() : 0
                var diff  = frstW - scndW

                if (diff !== 0 && $frstAction.length) {
                  angular.element('<div>').css({
                      '-webkit-box-flex': '10',
                      'max-width': Math.abs(diff)
                    })[diff > 0 ? 'insertBefore' : 'insertAfter']($title)
                }
              }, 0)
            }
          } else {
            var $icon = angular.element('<bp-navbar-icon>')

            $frstAction = $actions.eq(0)
            $scndAction = $actions.eq(1)
            scope.convertActionToIcon($frstAction)
            scope.convertActionToIcon($scndAction)
            scope.convertActionToIcon($up)

            if ($actions.length > 2) {
              $toolbar = $compile(angular.element('<bp-action-overflow>')
                .append($actions.not($frstAction).not($scndAction)))(scope)
            }

            if (angular.isElement($up)) {
              $up.append('<div>', $icon)
              element.append($up, $title, $frstAction, $scndAction, $toolbar)
            } else {
              element.append($icon, $title, $frstAction, $scndAction, $toolbar)
            }
          }
        })
      }
    }
  }
})
