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
        $action
          .attr('aria-label', $action.text())
          .text('')
          .removeClass('bp-button')
          .addClass('bp-icon')
      }
    },
    compile: function(elem, attrs, transcludeFn) {
      var ios = bpConfig.platform === 'android' ? false : true

      return function(scope, element, attrs) {
        var state = $state.current
        element.attr('role', 'navigation')

        transcludeFn(scope, function(clone) {
          var $arrow, $up
          if (angular.isUndefined(attrs.bpNavbarTitle)) {
            attrs.bpNavbarTitle = scope.getTitleFromState(state)
          }

          var $title = $compile('<bp-navbar-title role="heading">' +
            '{{ bpNavbarTitle }}</bp-navbar-title>')(scope)
          var $actions = clone.filter('bp-action')

          if (angular.isObject(state.data) &&
            angular.isString(state.data.up) &&
            !angular.isDefined(attrs.bpNavbarNoUp)) {

            var upState = $state.get(state.data.up)
            var upTitle = scope.getTitleFromState(upState)
            $arrow = angular.element('<bp-button-up>')
            $up = $compile('<bp-action class="bp-action-up" bp-sref="' +
              upState.name + '">' + upTitle + '</bp-action>')(scope)

            if (ios) {
              $actions = $up.add($actions)
            }
          }

          var $frstAction = $actions.eq(0)
          var $scndAction = $actions.eq(1)

          if (ios && $actions.length <= 2) {
            $actions.each(function() {
              var $action = angular.element(this)
              if ($action.hasClass('bp-icon')) {
                scope.convertActionToIcon($action)
              } else {
                $action.addClass('bp-button')
              }
            })

            element.append($frstAction, $title, $scndAction, $arrow)

            if (!scope.navbarTitle) {
              $timeout(function() {
                var difference = $scndAction.outerWidth() - $frstAction.outerWidth()

                if (difference !== 0 && $frstAction.length) {
                  var $spacer = angular.element('<div style="-webkit-box-flex:10  max-width:' +
                    (Math.abs(difference)) + 'px ">')
                  $spacer[difference > 0 ? 'insertBefore' : 'insertAfter']($title)
                }
              }, 0)
            }
          } else if (!ios && $actions.length <= 2) {
            $actions.each(function() {
              var $action = angular.element(this)
              scope.convertActionToIcon($action)
            })

            if ($up) {
              scope.convertActionToIcon($up)
            }

            var $icon = angular.element('<bp-navbar-icon>')

            if (angular.isElement($up)) {
              $up.append('<div>').append($icon)
              element.append($up, $title, $frstAction, $scndAction)
            } else {
              element.append($icon, $title, $frstAction, $scndAction)
            }
          }
        })
      }
    }
  }
})
