/**
@ngdoc directive
@name bp.directive:bpTap
@requires bp.util.bpTap
@restrict A
@element ANY
@param {expression} bpTap Expression to evaluate upon tap.
@param {string=} bpActiveClass CSS class that is applied to the element during tap. (`bp-active`)
@param {boolean=} bpAllowClick Whether to allow the original click event or not. (`false`)
@param {number=} bpBoundMargin Threshold one is allowed to move the finger before the tap is cancelled. (50)
@param {boolean=} bpNoScroll Whether to allow scrolling during tap or not. (`false`)
@example
<pre>
<bp-toolbar>
  <bp-action bp-tap="reload()">Reload</bp-action>
  <bp-action bp-tap="openShareSheet()">Share</bp-action>
</bp-toolbar>
</pre>
@description
`bpTap` is similiar to Angular's own `ngClick` directive,
as it executes the provided expression, but without 300ms delay.

`bpBoundMargin` and `bpNoScroll` are automatically set based on context.

Bradypodion doesn't rely on `ngTouch`'s click directive,
as this one provides fine grained control.

<div class="alert alert-info">
  You may define default configuration for taps with the {@link bp.util.bpTapProvider provider}.
</div>
 */

angular.module('bp').directive('bpTap', function($parse, bpTap) {
  return function(scope, element, attrs) {
    var tap = bpTap(element, attrs)
    element.bind('tap', function(e, touch) {
      scope.$apply($parse(attrs.bpTap), {
        $event: e,
        touch: touch
      })
      return false
    })
    scope.$on('$destroy', function() {
      tap.disable()
    })
  }
})
