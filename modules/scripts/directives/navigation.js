angular.module('bp')
  .directive('bpNavigation', function($state, $compile, $animate, bpView, bpApp) {
    return {
      controller: function() {
        this.configs = {}

        this.registerNavbar = function(attrs, $actions, state, scope) {
          var attrsHash = {}

          if (angular.isObject(attrs) && angular.isObject(attrs.$attr)) {
            for (var attr in attrs.$attr) {
              attrsHash[attrs.$attr[attr]] = attrs[attr]
            }
          }

          this.configs[state.name] = {
            $actions: $actions,
            attrs: attrsHash,
            noNavbar: (angular.isDefined(attrs.bpNavbarNoNavbar) ? true : false),
            scope: scope
          }
        }
      },
      link: function(scope, element, attrs, ctrl) {
        var $wrapper = angular.element('<bp-navbar-wrapper>')
        var $oldNavbar

        element.prepend($wrapper)

        scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
          var $navbar = angular.element()
          var navbarConfig = ctrl.configs[toState.name] || {}
          var direction = bpView.getDirection(fromState, toState)
          var isSlide = bpView.getType(fromState, toState, direction) === 'slide'
          var isIos = bpApp.platform === 'ios'

          if (!navbarConfig.noNavbar) {
            $wrapper.show()
            $navbar = angular.element('<bp-navbar>')
              .append(navbarConfig.$actions)
              .attr(navbarConfig.attrs || {})

            if (angular.isDefined(navbarConfig.scope)) {
              $compile($navbar)(navbarConfig.scope)
            } else {
              $compile($navbar)(scope)
            }
          } else {
            $wrapper.hide()
          }

          delete ctrl.configs[toState.name]

          if (isIos && isSlide && direction && angular.isElement($oldNavbar)) {
            var animation = 'bp-navbar-' + direction
            $animate.enter($navbar.addClass(animation),$wrapper, null, function() {
              $navbar.removeClass(animation)
            })
            $animate.leave($oldNavbar.addClass(animation))
          } else {
            $wrapper.append($navbar)
            if (angular.isElement($oldNavbar)) {
              $oldNavbar.remove()
            }
          }

          $oldNavbar = $navbar
        })
      }
    }
  })
