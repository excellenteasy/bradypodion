###
  bradypodion button directive
  @since 0.1.0
  @example Simple button with title
    <bg-button title="test"></bg-button>
  @return [Object<restrict|template|link>] Angular directive
###
bpButton = ->
  restrict: 'ACE'
  template: '{{ title }}'
  link: (scope, element, attrs) ->
    scope.title = attrs.title

angular.module('bp.directives', [])
  .directive 'bpButton', bpButton
