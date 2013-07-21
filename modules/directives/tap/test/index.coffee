injector = angular.injector ['ng', 'bp']

module 'tap', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'tapDirective', ->
  element =
    @$compile('<bp-navbar><bp-button bp-tap></bp-button></bp-navbar>') @$scope
  equal element.find('bp-button').attr('bp-no-scroll'), '', 'auto no-scroll'

  element =
    @$compile('<div bp-iscroll><bp-cell bp-tap></bp-cell></div>') @$scope
  equal element.find('[bp-tap]').attr('bp-bound-margin'), '5',
    'auto bound margin is 5'
