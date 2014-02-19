angular.module('bp').directive('bpToolbar', function(bpConfig) {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element, attrs) {
        if (bpConfig.platform === 'android') {
          element.attr('aria-hidden', 'true');
        } else {
          element.attr({
            role: 'toolbar'
          });
          transcludeFn(scope, function(clone) {
            var $actions;
            $actions = clone.filter('bp-action');
            $actions.each(function() {
              var $action;
              $action = angular.element(this);
              $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
            });
            element.append($actions);
          });
        }
      };
    }
  };
});
