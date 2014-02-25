angular.module('bp')
  .directive('bpNavigation', function($state, $compile, $animate, bpView, bpConfig) {
    return {
      controller: function($scope) {
        $scope.bpNavbarConfig = {}

        this.registerNavbar = function(attrs, $actions, state) {
          var attrsHash = {}

          if (angular.isObject(attrs) && angular.isObject(attrs.$attr)) {
            for (var attr in attrs.$attr) {
              attrsHash[attrs.$attr[attr]] = attrs[attr]
            }
          }

          $scope.bpNavbarConfig[state.name] = {
            $actions: $actions,
            attrs: attrsHash,
            noNavbar: (angular.isDefined(attrs.bpNavbarNoNavbar) ? true : false)
          }
        }
      },
      link: function(scope, element) {
        var $wrapper = angular.element('<bp-navbar-wrapper>')
        var $oldNavbar

        element.prepend($wrapper)

        scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
          var $navbar = angular.element()
          var navbarConfig = scope.bpNavbarConfig[toState.name] || {}
          var direction = bpView.getDirection(fromState,toState)
          if (!navbarConfig.noNavbar) {
            $navbar = angular.element('<bp-navbar>')
              .append(navbarConfig.$actions)
              .attr(navbarConfig.attrs || {})
          }
          $compile($navbar)(scope)
          if (bpConfig.platform === 'ios' && angular.isElement($oldNavbar)) {
            var animation = 'bp-navbar-' + direction
            $animate.enter($navbar.addClass(animation),$wrapper);
            $animate.leave($oldNavbar.addClass(animation), function() {
              $oldNavbar = $navbar.removeClass(animation)
            })
          } else {
            $wrapper.append($navbar)
            if (angular.isElement($oldNavbar)) {
              $oldNavbar.remove()
            }
            $oldNavbar = $navbar
          }
        })
      }
    }
  })
