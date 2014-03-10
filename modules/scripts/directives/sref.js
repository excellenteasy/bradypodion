/**
@ngdoc directive
@name bp.directive:bpSref
@requires bp.util.bpTap
@restrict A
@element ANY
@param {string} bpSref Name of the state to transition to. You can define params for the state like this:
`statename({id: 1})`,
@example
<pre>
<bp-navbar>
  <bp-action bp-sref="customers">Overview</bp-action>
  <bp-action bp-sref="customer({id: 4})">Detail</bp-action>
</bp-navbar>
</pre>
@description
`bpSref` is similiar to Angular UI Router's own `uiSref` directive,
as it transitions to a state, but without 300ms delay.

<div class="alert alert-info">
  The tap behavior may be changed with the same attriubutes as with {@link bp.directive:bpTap `bpTap`}.
</div>
 */

angular.module('bp').directive('bpSref', function($state, $parse, bpTap, bpView) {
  return function(scope, element, attrs) {
    var ref = bpView.parseState(attrs.bpSref, scope)
    var tap = bpTap(element, attrs)
    element.bind('tap', function() {
      $state.go(ref.state,ref.params)
      return false
    })
    scope.$on('$destroy', function() {
      tap.disable()
    })
  }
})
