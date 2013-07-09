###
  bradypodion button directive
  @since 0.1.0
  @example Simple button with title
    <bp-button title="test"></bp-button>
  @return [Object<restrict|template|link>] Angular directive
###
bpButton = ->
  restrict: 'E'
  template: '{{ title }}'
  link: (scope, element, attrs) ->
    scope.title = attrs.title

angular.module('bp.directives').directive 'bpButton', bpButton
