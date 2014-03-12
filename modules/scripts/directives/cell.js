/**
@ngdoc directive
@name bp.directive:bpCell
@restrict E
@param {string} class You can define different cell styles.

`bp-cell-value1` | `bp-cell-value2` | `bp-cell-subtitle`
@example
<pre>
  <bp-cell>Cell</bp-cell>
</pre>
<pre>
  <bp-cell class="bp-cell-value1">
    <div class="label">Label</div>
    <div class="value">Value</div>
  </bp-cell>
</pre>
<pre>
  <bp-cell class="bp-cell-value2">
    <div class="label">Label</div>
    <div class="value">Value</div>
  </bp-cell>
</pre>
<pre>
  <bp-cell class="bp-cell-subtitle">
    <div class="titles">
      <div class="title">Title</div>
      <div class="subtitle">Subtitle</div>
    </div>
  </bp-cell>
</pre>
@description
`bpCell` is a interface element that, together with other cells, constitutes a {@link bp.directive:bpTable `bpTable`}.
 */

angular.module('bp').directive('bpCell', function() {
  return {
    restrict: 'E',
    transclude: true,
    compile: function(elem, attrs, transcludeFn) {
      return function(scope, element) {
        transcludeFn(scope, function(clone) {
          element.attr({
            role: 'listitem'
          }).append(clone)
        })
      }
    }
  }
})
