angular.module('bp').directive('bpNavbar', function(bpConfig, $timeout, $state, $compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      bpNavbarTitle: '@'
    },
    controller: function($scope) {
      $scope.getTitleFromState = function(state) {
        var _ref;
        return ((_ref = state.data) != null ? _ref.title : void 0) || state.name.charAt(0).toUpperCase() + state.name.slice(1);
      };
      return $scope.convertActionToIcon = function($action) {
        return $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
      };
    },
    compile: function(elem, attrs, transcludeFn) {
      var ios;
      ios = bpConfig.platform === 'android' ? false : true;
      return function(scope, element, attrs) {
        var state;
        state = $state.current;
        element.attr({
          role: 'navigation'
        });
        return transcludeFn(scope, function(clone) {
          var $actions, $arrow, $frstAction, $icon, $scndAction, $title, $up, upState, upTitle, _ref;
          if (attrs.bpNavbarTitle == null) {
            attrs.bpNavbarTitle = scope.getTitleFromState(state);
          }
          $title = $compile("<bp-navbar-title role='heading'>{{ bpNavbarTitle }}</bp-navbar-title>")(scope);
          $actions = clone.filter('bp-action');
          if ((((_ref = state.data) != null ? _ref.up : void 0) != null) && (attrs.bpNavbarNoUp == null)) {
            upState = $state.get(state.data.up);
            upTitle = scope.getTitleFromState(upState);
            $up = $compile("<bp-action class='bp-action-up' bp-sref='" + upState.name + "'>" + upTitle + "</bp-action>")(scope);
            if (ios) {
              $actions = $up.add($actions);
            }
            $arrow = angular.element('<bp-button-up>');
          }
          if ($actions.length <= 2) {
            $frstAction = $actions.eq(0);
            $scndAction = $actions.eq(1);
            if (ios) {
              $actions.each(function() {
                var $action;
                $action = angular.element(this);
                if ($action.hasClass('bp-icon')) {
                  return scope.convertActionToIcon($action);
                } else {
                  return $action.addClass('bp-button');
                }
              });
              element.append($frstAction, $title, $scndAction, $arrow);
              if (!scope.navbarTitle) {
                return $timeout(function() {
                  var $spacer, difference;
                  difference = $scndAction.outerWidth() - $frstAction.outerWidth();
                  if (difference !== 0 && $frstAction.length) {
                    $spacer = angular.element("<div style=' -webkit-box-flex:10; max-width:" + (Math.abs(difference)) + "px '>");
                    return $spacer[difference > 0 ? 'insertBefore' : 'insertAfter']($title);
                  }
                }, 0);
              }
            } else {
              $actions.each(function() {
                var $action;
                $action = angular.element(this);
                return scope.convertActionToIcon($action);
              });
              if ($up) {
                scope.convertActionToIcon($up);
              }
              $icon = angular.element('<bp-navbar-icon>');
              if ($up != null) {
                $up.append('<div>').append($icon);
                return element.append($up, $title, $frstAction, $scndAction);
              } else {
                return element.append($icon, $title, $frstAction, $scndAction);
              }
            }
          }
        });
      };
    }
  };
});
