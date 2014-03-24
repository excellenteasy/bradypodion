/**
@ngdoc directive
@restrict E
@name bp.directive:bpTabbar
@description A bar that should be filled with  {@link bp.directive:bpTab `bpTab`}s.
*/

angular.module('bp').directive('bpTabbar', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      if (!attrs.role) {
        element.attr('role', 'tablist')
      }
    }
  }
})

/**
@ngdoc directive
@restrict E
@name bp.directive:bpTab
@requires bp.util.bpView
@scope true
@priority 100
@param {string} bpSref The name of the state the tab is associated to.
@param {string} bpTabIcon A CSS class that represents a font-icon for the tab.
@param {string=} bpTabTitle The title of the tab. By default it's read from the associated state.
@description A tab within a  {@link bp.directive:bpTabbar `bpTabbar`}.
@example
<pre>
<bp-tabbar>
  <bp-tab bp-sref='first'  bp-tab-icon="icon-bookmark"></bp-tab>
  <bp-tab bp-sref='second' bp-tab-icon="icon-comment"></bp-tab>
  <bp-tab bp-sref='third'  bp-tab-icon="icon-download"></bp-tab>
  <bp-tab bp-sref='fourth' bp-tab-icon="icon-inbox"></bp-tab>
  <bp-tab bp-sref='fifth'  bp-tab-icon="icon-music"></bp-tab>
</bp-tabbar>
</pre>
*/

angular.module('bp').directive('bpTab', function($state, $compile, $timeout, bpView) {
  return {
    priority: 100,
    restrict: 'E',
    scope: {
      bpSref: '@',
      bpTabIcon: '@',
      bpTabTitle: '@'
    },
    link: function(scope, element, attrs) {
      var state = $state.get(bpView.parseState(scope.bpSref).state)
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

      element
        .append($icon, $title)
        .attr('role', attrs.role || 'tab')

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
