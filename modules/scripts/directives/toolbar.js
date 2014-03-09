angular.module('bp').directive('bpToolbar', function(bpApp) {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element) {
        if (bpApp.platform === 'android') {
          element.attr('aria-hidden', 'true')
        } else {
          element.attr({
            role: 'toolbar'
          })
          transcludeFn(scope, function(clone) {
            var $actions
            $actions = clone.filter('bp-action')
            $actions.each(function() {
              var $action = angular.element(this)
              $action
                .attr('aria-label', $action.text())
                .text('')
                .removeClass('bp-button')
                .addClass('bp-icon')
            })
            element.append($actions)
          })
        }
      }
    }
  }
})
