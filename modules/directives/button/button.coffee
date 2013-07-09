angular.module('bp.directives', [])
  .directive 'bpButton', ->
    restrict: 'ACE'
    template: '{{ title }}'
    link: (scope, element, attrs) ->
      scope.title = attrs.title
