# # Button

angular.module('bp.directives').directive 'bpButton', ->
  restrict: 'C'
  link: (scope, element, attrs) ->
    attributes =
      role: 'button'

    if element.hasClass('bp-button-back') and not attrs['aria-label']
      attributes['aria-label'] = if label = element.text()
        "Back to #{label}"
      else
        "Back"

    element.attr attributes
