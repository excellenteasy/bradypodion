angular.module('bp').directive('bpToolbar', deps(['bpConfig'], function(bpConfig) {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs) {
        if (bpConfig.platform === 'android') {
          return element.attr('aria-hidden', 'true');
        } else {
          element.attr({
            role: 'toolbar'
          });
          return transcludeFn(scope, function(clone) {
            var $actions;
            $actions = clone.filter('bp-action');
            $actions.each(function() {
              var $action;
              $action = angular.element(this);
              return $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
            });
            return element.append($actions);
          });
        }
      };
    }
  };
}));
