angular.module('bp').directive('bpTabbar', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      return element.attr({
        role: 'tablist'
      });
    }
  };
});

angular.module('bp').directive('bpTab', deps(['$state', '$compile', '$timeout'], function($state, $compile, $timeout) {
  return {
    restrict: 'E',
    scope: {
      bpSref: '@',
      bpTabIcon: '@',
      bpTabTitle: '@'
    },
    link: function(scope, element, attrs) {
      var $icon, $title, state, _ref, _ref1, _ref2;
      element.attr({
        role: 'tab'
      });
      state = $state.get(scope.bpSref);
      if (attrs.bpTabTitle == null) {
        attrs.bpTabTitle = ((_ref = state.data) != null ? _ref.title : void 0) || ((_ref1 = state.name) != null ? _ref1.charAt(0).toUpperCase() : void 0) + ((_ref2 = state.name) != null ? _ref2.slice(1) : void 0);
      }
      $icon = $compile("<span class='bp-icon {{bpTabIcon}}'></span>")(scope);
      $title = $compile("<span>{{ bpTabTitle }}</span>")(scope);
      element.append($icon, $title);
      scope.$on('$stateChangeSuccess', function() {
        if ($state.includes(scope.bpSref)) {
          return element.addClass('bp-tab-active').attr('aria-selected', 'true');
        } else {
          return element.removeClass('bp-tab-active').attr('aria-selected', 'false');
        }
      });
      element.bind('touchstart', function() {
        return $timeout(function() {
          return element.trigger('touchend');
        }, 500);
      });
      return scope.$on('$destroy', function() {
        return element.unbind('touchstart');
      });
    }
  };
}));
