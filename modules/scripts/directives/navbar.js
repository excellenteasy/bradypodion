angular.module('bp')
  .directive('bpNavbar', function(
    bpApp,
    bpView,
    $timeout,
    $state,
    $compile) {

  return {
    restrict: 'E',
    transclude: true,
    controller: function() {
      this.getTitleFromState = function(state) {
        if (angular.isObject(state.data) &&
          angular.isString(state.data.title)) {

          return state.data.title
        } else {
          return state.name.charAt(0).toUpperCase() + state.name.slice(1)
        }
      }
      this.convertActionToIcon = function($action) {
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
      var ios = bpApp.platform === 'android' ? false : true

      return function(scope, element, attrs, ctrl) {
        var state = $state.current
        element.attr('role', 'navigation')

        transcludeFn(scope, function(clone) {
          var $arrow, $frstAction, $scndAction, $toolbar, $up, title

          if (angular.isUndefined(attrs.bpNavbarTitle)) {
            title = ctrl.getTitleFromState(state)
          } else {
            title = attrs.bpNavbarTitle
          }

          var $title = $compile(angular.element('<bp-navbar-title>')
            .attr('role', 'heading')
            .text(title)
            )(scope)

          var $actions = clone.filter('bp-action')

          var up

          if (angular.isObject(state.data) &&
            angular.isString(state.data.up)) {
            up = state.data.up
          } else if (state.url) {
            var urlSegments = bpView._getURLSegments(state)
            up = urlSegments[urlSegments.length - 2]
          }

          if (up && !angular.isDefined(attrs.bpNavbarNoUp)) {

            var ref = bpView.parseState(up)
            var upState = $state.get(ref.state)
            var upTitle = ctrl.getTitleFromState(upState)
            $arrow = angular.element('<bp-button-up>')
            $up = $compile(angular.element('<bp-action>')
              .addClass('bp-action-up')
              .attr('bp-sref', up)
              .text(upTitle))(scope)
          }

          if (ios) {
            if ($actions.length > 2) {
              if (angular.isElement($up)) {
                $frstAction = $up.addClass('bp-button')
              }

              $actions.each(function() {
                ctrl.convertActionToIcon(angular.element(this))
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
                  ctrl.convertActionToIcon($action)
                } else {
                  $action.addClass('bp-button')
                }
              })
            }

            element
              .append($frstAction, $title, $scndAction, $arrow)
              .after($toolbar)

            if (angular.isElement($toolbar)) {
              element.on('$destroy', function() {
                $toolbar.remove()
              })
            }

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
              }, 0, false)
            }
          } else {
            var $icon = angular.element('<bp-navbar-icon>')

            $frstAction = $actions.eq(0)
            $scndAction = $actions.eq(1)
            ctrl.convertActionToIcon($frstAction)
            ctrl.convertActionToIcon($scndAction)
            ctrl.convertActionToIcon($up)

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
