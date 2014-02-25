angular.module('bp').directive('bpTabbar', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.attr({
        role: 'tablist'
      })
    }
  }
})

angular.module('bp').directive('bpTab', function($state, $compile, $timeout) {
  return {
    restrict: 'E',
    scope: {
      bpSref: '@',
      bpTabIcon: '@',
      bpTabTitle: '@'
    },
    link: function(scope, element, attrs) {
      element.attr({
        role: 'tab'
      })
      var state = $state.get(scope.bpSref)
      if (angular.isUndefined(attrs.bpTabTitle)) {
        if (angular.isObject(state.data) && state.data.title) {
          attrs.bpTabTitle = state.data.title
        } else if (state.name) {
          attrs.bpTabTitle = state.name.charAt(0).toUpperCase() +
            state.name.slice(1)
        }
      }
      var $icon = $compile(angular.element('<span>')
        .addClass('bp-icon {{bpTabIcon}}'))(scope)

      var $title = $compile(angular.element('<span>')
        .attr('ng-bind', 'bpTabTitle'))(scope)

      element.append($icon, $title)

      scope.$on('$stateChangeSuccess', function() {
        if ($state.includes(scope.bpSref)) {
          element
            .addClass('bp-tab-active')
            .attr('aria-selected', 'true')
        } else {
          element
            .removeClass('bp-tab-active')
            .attr('aria-selected', 'false')
        }
      })

      element.bind('touchstart', function() {
        $timeout(function() {
          element.trigger('touchend')
        }, 500)
      })

      scope.$on('$destroy', function() {
        element.unbind('touchstart')
      })
    }
  }
})
