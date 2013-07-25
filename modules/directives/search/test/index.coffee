injector = angular.injector ['ng', 'bp']

module 'search', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'searchDirective', ->
  expect 3
  element = @$compile('<bp-search><input type="text" /></bp-search>') @$scope
  ok element.has('input').length, 'input field preserved in search'
  ok element.has('bp-button[bp-tap][bp-no-scroll]').length,
    'has button with tap and no-scroll directive'
  equal element.find('bp-button').text(), 'Cancel', 'button title is Cancel'
