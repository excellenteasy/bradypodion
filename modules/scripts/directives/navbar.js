/**
@ngdoc directive
@restrict E
@name bp.directive:bpNavbar
@requires bp.util.bpApp
@requires bp.util.bpView
@requires bp.directive:bpToolbar
@requires bp.directive:bpActionOverflow
@param {boolean=} bp-navbar-no-up Don't show the default up button from the state (false).
@param {string=} bp-navbar-title The title of the navbar. Defaults to the current state's title.
@example
<pre>
  <bp-navbar bp-navbar-title="Hello World" bp-navbar-no-up>
    <bp-action class="icon-cross">Cancel</bp-action>
    <bp-action class="icon-checkmark">Save</bp-action>
  </bp-navbar>
</pre>
@description `bpNavbar` is the beating heart of Bradypodion as it provides the structure for your application.

The navbar tries to fill itself with the right information based on the context of the current state.

<div class="alert alert-info">
  The {@link bp.directive:bpNavigation `bpNavigation`} directive offers a convenient way to inject navbars in all of your screens automatically.
</div>

## Title
Based on [ui.router's](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.$state)
`$state.current` the `bp-navbar-title` is filled with `state.data.title` or `state.name` (First letter capitalized).

If you want to define a custom Title for the navbar just assign any string to the `bp-navbar-title` attribute.
If you don’t want any title at all just assign an empty string.

## Up Button

<div class="alert alert-info">
  "Up" Button should be more familiar to iOS developers as "Back" button,
  but it's named "Up" throughout the framework to maintain a consistent and semantically correct naming for all platforms.
</div>

The navbar automatically injects an up button for you. The state information is either taken directly from `$state.data.up` or read from the URL of the state.
If the URL of the current state is `/customers/:id` and `customers` is a valid state name then this will be the up button's target.
The up button's label is determined in the same way as the navbar's title.

## Actions

{@link bp.directive:bpAction `bpAction`}s are (currently) the only supported content within a navbar.
They are automatically processed to be icons on android and buttons on ios.
You can however force an action to be an icon on ios by adding the `bp-icon` CSS class.

### Action Overflow

The navbar offers space for two actions on both ios and android.
If you define more than those two actions on ios the navbar will automatically spawn a {@link bp.directive:bpToolbar `bpToolbar`} for you.
On android it will create a {@link bp.directive:bpActionOverflow `bpActionOverflow`} menu for you.

<div class="alert">
  On ios the injected up button counts against the action limit.
  So in most cases, unless you decide to set `bp-navbar-no-up` to true, there is space for one action.
</div>
*/

angular.module('bp')
  .directive('bpNavbar', function(
    bpApp,
    bpView,
    $timeout,
    $state,
    $compile,
    $log) {

  return {
    restrict: 'E',
    transclude: true,
    controller: function() {
      this.getTitleFromState = function(state) {
        if (angular.isObject(state.data) &&
          angular.isString(state.data.title)) {

          return state.data.title
        } else {
          return state.name.charAt(0).toUpperCase() + state.name.slice(1)
        }
      }
      this.convertActionToIcon = function($action) {
        if (angular.isElement($action)) {
          var label = $action.attr('aria-label') || $action.text()
          $action
            .attr('aria-label', label)
            .text('')
            .removeClass('bp-button')
            .addClass('bp-icon')
        }
      }
    },
    compile: function(elem, attrs, transcludeFn) {
      var ios = bpApp.platform === 'android' ? false : true

      return function(scope, element, attrs, ctrl) {
        var state = $state.current
        element.attr('role', attrs.role || 'navigation')

        transcludeFn(scope, function(clone) {
          var $arrow, $frstAction, $scndAction, $toolbar, $up, title

          if (angular.isUndefined(attrs.bpNavbarTitle)) {
            title = ctrl.getTitleFromState(state)
          } else {
            title = attrs.bpNavbarTitle
          }

          var $title = $compile(angular.element('<bp-navbar-title>')
            .attr('role', 'heading')
            .text(title)
            )(scope)

          var $actions = clone.filter('bp-action')

          var up

          if (angular.isObject(state.data) &&
            angular.isString(state.data.up)) {
            up = state.data.up
          } else if (state.url) {
            var urlSegments = bpView._getURLSegments(state)
            up = urlSegments[urlSegments.length - 2]
          }

          if (up && up[0] == ':') {
            $log.error('cannot detect up state from parameter. Please set the up property on the data object in your state configuration.')
          }

          if (up && up[0] !== ':' && !angular.isDefined(attrs.bpNavbarNoUp)) {
            var ref = bpView.parseState(up)
            var upState = $state.get(ref.state)
            if (upState) {
              var upTitle = ctrl.getTitleFromState(upState)
              $arrow = angular.element('<bp-button-up>')
              $up = $compile(angular.element('<bp-action>')
                .addClass('bp-action-up')
                .attr('bp-sref', up)
                .text(upTitle))(scope)
            } else {
              $log.error('up state detection failed. No up button compiled. Check your state configuration.')
            }
          }

          if (ios) {
            if ($actions.length > 2) {
              if (angular.isElement($up)) {
                $frstAction = $up.addClass('bp-button')
              }

              $actions.each(function() {
                ctrl.convertActionToIcon(angular.element(this))
              })
              $toolbar = angular.element('<bp-toolbar>').append($actions)
            } else {
              if (angular.isElement($up)) {
                $actions = $up.add($actions)
              }
              $frstAction = $actions.eq(0)
              $scndAction = $actions.eq(1)

              $actions.each(function() {
                var $action = angular.element(this)
                if ($action.hasClass('bp-icon')) {
                  ctrl.convertActionToIcon($action)
                } else {
                  $action.addClass('bp-button')
                }
              })
            }

            element
              .append($frstAction, $title, $scndAction, $arrow)
              .after($toolbar)

            if (angular.isElement($toolbar)) {
              element.on('$destroy', function() {
                $toolbar.remove()
              })
            }

            if (!scope.navbarTitle) {
              $timeout(function() {
                var frstW = angular.isElement($scndAction) ? $scndAction.outerWidth() : 0
                var scndW = angular.isElement($frstAction) ? $frstAction.outerWidth() : 0
                var diff  = frstW - scndW

                if (diff !== 0 && $frstAction.length) {
                  angular.element('<div>').css({
                      '-webkit-box-flex': '10',
                      'max-width': Math.abs(diff)
                    })[diff > 0 ? 'insertBefore' : 'insertAfter']($title)
                }
              }, 0, false)
            }
          } else {
            var $icon = angular.element('<bp-navbar-icon>')

            $frstAction = $actions.eq(0)
            $scndAction = $actions.eq(1)
            ctrl.convertActionToIcon($frstAction)
            ctrl.convertActionToIcon($scndAction)
            ctrl.convertActionToIcon($up)

            if ($actions.length > 2) {
              $toolbar = $compile(angular.element('<bp-action-overflow>')
                .append($actions.not($frstAction).not($scndAction)))(scope)
            }

            if (angular.isElement($up)) {
              $up.append('<div>', $icon)
              element.append($up, $title, $frstAction, $scndAction, $toolbar)
            } else {
              element.append($icon, $title, $frstAction, $scndAction, $toolbar)
            }
          }
        })
      }
    }
  }
})
