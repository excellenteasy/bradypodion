# # Toolbar

angular.module('bp').directive 'bpToolbar', deps [
  'bpConfig'
  ], (
  bpConfig
  )->
  restrict: 'E'
  transclude: true
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      if bpConfig.platform is 'android'
        element.attr 'aria-hidden', 'true'
      else
        element.attr
          role: 'toolbar'

        transcludeFn scope, (clone) ->
          $actions = clone.filter 'bp-action'
          $actions.each ->
            $action = angular.element this
            $action
              .attr 'aria-label', $action.text()
              .text ''
              .removeClass 'bp-button'
              .addClass 'bp-icon'

          element.append $actions