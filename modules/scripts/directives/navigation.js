angular.module('bp')
  .directive('bpNavigation', function($state, $compile) {
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
        var $oldNavbar = angular.element()
        scope.$on('$stateChangeSuccess', function(event, toState) {
          var $navbar = angular.element()
          var navbarConfig = scope.bpNavbarConfig[toState.name] || {}
          if (!navbarConfig.noNavbar) {
            $navbar = angular.element('<bp-navbar>')
              .append(navbarConfig.$actions)
              .attr(navbarConfig.attrs || {})
          }
          element.prepend($navbar)
          $compile($navbar)(scope)
          $oldNavbar.remove()
          $oldNavbar = $navbar
        })
      }
    }
  })
