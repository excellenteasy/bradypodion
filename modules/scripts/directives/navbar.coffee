# # Navbar

angular.module('bp.directives').directive 'bpNavbar', deps [
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
  compile: (elem, attrs, transcludeFn) ->

    ios = if bpConfig.platform is 'android' then no else yes

    (scope, element, attrs) ->

      element.attr
        role: 'navigation'

      transcludeFn scope, (clone) ->
        unless attrs.bpNavbarTitle?
          attrs.bpNavbarTitle =
            $state.current.data?.title or
            (do ->
            name = $state.current.name
            name.charAt(0).toUpperCase() + name.slice(1)
            )

        $title = $compile("
          <bp-navbar-title role='heading'>
            {{bpNavbarTitle}}
          </bp-navbar-title>")(scope)

        $actions = clone.filter 'bp-action'

        if $actions.length <= 2

          $frstAction = $actions.eq 0
          $scndAction = $actions.eq 1

          if ios

            $actions.addClass 'bp-button'
            element.append $frstAction, $title, $scndAction


            unless scope.navbarTitle then $timeout ->
              difference = $scndAction.outerWidth() - $frstAction.outerWidth()
              if difference isnt 0 and $frstAction.length
                $spacer = $("
                  <div style='
                    -webkit-box-flex:10;
                    max-width:#{Math.abs(difference)}px
                  '>")
                if difference > 0
                  $spacer.insertBefore $title
                else if difference < 0
                  $spacer.insertAfter $title
            , 0

          else

            $actions.each ->
              $action = angular.element this
              $action
                .attr 'aria-label', $action.text()
                .text ''
                .addClass 'bp-icon'

            element.append $title, $frstAction, $scndAction

        else

          # TODO: implement Toolbar/Action overflow
          console.warn 'Toolbar/Action overflow implementation missing'
          console.log $actions
