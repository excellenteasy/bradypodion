/**
@ngdoc directive
@name bp.directive:bpTable
@restrict E
@example
## Plain Table
<pre>
<bp-table>
  <bp-table-header>Header</bp-table-header>
  <bp-cell>Content</bp-cell>
  <bp-cell>Content</bp-cell>
  <bp-cell>Content</bp-cell>
  <bp-cell>Content</bp-cell>
</bp-table>
</pre>

## Grouped Table
<pre>
<bp-table class="bp-table-grouped">
  <bp-table-grouped-header>Header</bp-table-grouped-header>
  <bp-table>
    <bp-cell>Content</bp-cell>
    <bp-cell>Content</bp-cell>
    <bp-cell>Content</bp-cell>
    <bp-cell>Content</bp-cell>
  </bp-table>
  <bp-table-grouped-footer>Footer</bp-table-grouped-footer>
</bp-table>
</pre>

## Together with Search & Scroll
<pre>
<bp-search>
  <input ng-model="search">
</bp-search>
<bp-table bp-scroll>
  <bp-cell ng-repeat="cell in cells | filter:search">{{ data }}</bp-cell>
</bp-table>
</pre>

@description `bpTable` is an universal interface element used to represent (huge) datasets in lists.
 */

angular.module('bp').directive('bpTable', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      if (!attrs.role) {
        var role = element.parents('bp-table').length ? 'group' : 'list'
        element.attr('role', role)
      }
    }
  }
})
