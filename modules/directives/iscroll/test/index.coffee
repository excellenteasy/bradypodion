injector = angular.injector ['ng', 'bp']

module 'iscroll', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'iscrollDirective', ->
  expect 2

  innerhtml = '<ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>'
  html = "<div bp-iscroll bp-iscroll-no-scrollbars>#{innerhtml}</div>"
  element = @$compile(html) @$scope

  ok element.children().is('bp-iscroll-wrapper'),
    'immediate child of is bp-iscroll-wrapper'
  ok element.children().children().is('ul'),
    'transclude children inside bp-iscroll-wrapper'
