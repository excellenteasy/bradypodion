# # Navbar

angular.module('bp').directive 'bpNavbar', deps [
  'bpConfig'
  '$timeout'
  '$state'
  '$compile'
  ], (
  bpConfig
  $timeout
  $state
  $compile
  ) ->
  restrict: 'E'
  transclude: true
  scope:
    bpNavbarTitle: '@'
  controller: ($scope) ->
    $scope.getTitleFromState = (state) ->
      state.data?.title or
      state.name.charAt(0).toUpperCase() + state.name.slice(1)

  compile: (elem, attrs, transcludeFn) ->
    ios = if bpConfig.platform is 'android' then no else yes
    (scope, element, attrs) ->
      state = $state.current

      element.attr
        role: 'navigation'

      transcludeFn scope, (clone) ->
        unless attrs.bpNavbarTitle?
          attrs.bpNavbarTitle = scope.getTitleFromState state

        $title = $compile("
          <bp-navbar-title role='heading'>{{
            bpNavbarTitle
          }}</bp-navbar-title>") scope

        $actions = clone.filter 'bp-action'

        if state.data?.up? and not attrs.bpNavbarNoUp?
          upState = $state.get state.data.up
          upTitle = scope.getTitleFromState upState
          $up = $compile("
            <bp-action class='bp-action-up' bp-sref='#{upState.name}'>#{
              upTitle
            }</bp-action>") scope
          $actions = $up.add $actions if ios
          $arrow = angular.element '<bp-button-up>'

        if $actions.length <= 2
          $frstAction = $actions.eq 0
          $scndAction = $actions.eq 1

          if ios
            $actions.addClass 'bp-button'
            element.append $frstAction, $title, $scndAction, $arrow

            unless scope.navbarTitle then $timeout ->
              difference = $scndAction.outerWidth() - $frstAction.outerWidth()
              if difference isnt 0 and $frstAction.length
                $spacer = angular.element("
                  <div style='
                    -webkit-box-flex:10;
                    max-width:#{Math.abs(difference)}px
                  '>")
                $spacer[if difference > 0
                  'insertBefore'
                else 'insertAfter'] $title
            , 0

          else
            handleAction = ($action) ->
              $action
                .attr 'aria-label', $action.text()
                .text ''
                .addClass 'bp-icon'

            $actions.each ->
              $action = angular.element this
              handleAction $action

            handleAction $up if $up

            $icon = angular.element '<bp-navbar-icon>'

            if $up?
              $up
                .append '<div>'
                .append $icon

              element.append $up, $title, $frstAction, $scndAction
            else
              element.append $icon, $title, $frstAction, $scndAction

        # else
        # TODO: implement Toolbar/Action overflow
