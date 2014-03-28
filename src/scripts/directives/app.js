/**
@ngdoc directive
@name bp.directive:bpApp
@requires bp.util.bpApp
@requires bp.util.bpView
@restrict AE
@example
<pre>
<html>
  <head>
    <title>Bradypodion App</title>
  </head>
  <body ng-app="bradypodionApp" bp-app>
    ...
  </body>
</pre>
@description
The bpApp directive is similiar to Angular's own ngApp directive.
It is used to initalize a Bradypodion application, as it applies important CSS information and sets up transitions.
You will be fine by putting it right next to the ngApp directive.
 */
angular.module('bp').directive('bpApp', function($compile, bpApp) {
  return {
    restrict: 'AE',
    controller: function(bpView) {
      this.onStateChangeStart = function(
        event,
        toState,
        toParams,
        fromState) {

        var direction = toParams.direction ||
          bpView.getDirection(fromState, toState)

        var type = toParams.transition ||
          bpView.getType(fromState, toState, direction)

        this.setTransition(type, direction)
      }

      this.onViewContentLoaded = function() {
        var $views = angular.element('[ui-view], ui-view')

        if (!angular.isString(this.transition)) {
          $views.removeClass(this.lastTransition)
          return
        }

        $views
          .removeClass(this.lastTransition)
          .addClass(this.transition)
        this.lastTransition = this.transition
      }

      this.setTransition = function(type, direction) {
        if (angular.isString(type) && angular.isString(direction)) {
          this.transition = type + '-' + direction
          return
        }
        this.transition = null
      }

      this.onViewContentLoaded = angular.bind(this, this.onViewContentLoaded)
      this.onStateChangeStart = angular.bind(this, this.onStateChangeStart)

      return this
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$on('$stateChangeStart', ctrl.onStateChangeStart)
      scope.$on('$viewContentLoaded', ctrl.onViewContentLoaded)

      element
        .addClass(bpApp.platform)
        .attr('role', attrs.role || 'application')
    }
  }
})
