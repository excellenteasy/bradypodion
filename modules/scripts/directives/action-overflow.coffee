# # Action Overflow

angular.module('bp').directive 'bpActionOverflow', deps [
  '$window'
  'bpConfig'
  'BpTap'
  ], (
  $window
  bpConfig
  BpTap
  )->
  restrict: 'E'
  transclude: true
  controller: ($scope, $animate) ->
    $scope.open = ($menu) ->
      $menu.attr 'aria-hidden', 'false'
      $animate.addClass $menu, 'bp-action-overflow-open'
    $scope.close = ($menu) ->
      $menu.attr 'aria-hidden', 'true'
      $animate.removeClass $menu, 'bp-action-overflow-open'

  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      if bpConfig.platform is 'ios'
        element.attr 'aria-hidden', 'true'
      else
        element.attr
          role: 'button'
          'aria-has-popup': 'true'

        new BpTap scope, element, attrs

        open = false

        transcludeFn scope, (clone) ->
          $actions = clone.filter 'bp-action'
          $actions.each ->
            $action = angular.element this
            $action
              .attr 'role', 'menu-item'
              .addClass 'bp-button'

          $menu = angular.element('<bp-action-overflow-menu>')
            .attr
              'role': 'menu'
              'aria-hidden': 'true'
            .append $actions

          $$window = angular.element($window)

          element.append $menu

          element.on 'tap', ->
            if open
              scope.close $menu
              open = false
            else
              scope.open $menu
              open = true

          $actions.on 'touchstart', (e) ->
            e.stopPropagation()

          $$window.on 'touchstart', (e) ->
            if open
              scope.close $menu
              open = false
              # prevent tap from happening on the icon again
              element.trigger 'touchcancel'
