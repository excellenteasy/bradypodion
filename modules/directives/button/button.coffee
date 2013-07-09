angular.module('button', [])
  .directive 'button', ->
    restrict: 'ACE'
    template: '{{ title }}'
    link: (scope, element, attrs) ->
      scope.title = attrs.title
