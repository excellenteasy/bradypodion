injector = angular.injector ['ng', 'bp']

module 'button', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'buttonDirective', ->
  text    = 'Some Test'
  element = @$compile("<bp-button>#{text}</bp-button>") @$scope
  equal element.attr('role'), 'button'
  equal text, element.text()
