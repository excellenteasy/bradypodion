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
      var $icon, $title, state
      element.attr({
        role: 'tab'
      })
      state = $state.get(scope.bpSref)
      if (attrs.bpTabTitle == null) {
        if (state.data && state.data.title) {
          attrs.bpTabTitle = state.data.title
        } else if (state.name) {
          attrs.bpTabTitle = state.name.charAt(0).toUpperCase() + state.name.slice(1)
        }
      }
      $icon = $compile('<span class="bp-icon {{bpTabIcon}}"></span>')(scope)
      $title = $compile('<span>{{ bpTabTitle }}</span>')(scope)
      element.append($icon, $title)
      scope.$on('$stateChangeSuccess', function() {
        if ($state.includes(scope.bpSref)) {
          element.addClass('bp-tab-active').attr('aria-selected', 'true')
        } else {
          element.removeClass('bp-tab-active').attr('aria-selected', 'false')
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
