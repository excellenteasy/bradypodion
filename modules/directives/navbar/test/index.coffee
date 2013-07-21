injector = angular.injector ['ng', 'bp']

module 'navbar', setup: ->
  @$scope   = injector.get('$rootScope').$new()
  @$compile = injector.get '$compile'

test 'navbarDirective', ->
  hText = 'Foo'
  navbarTemplate = "<bp-navbar>
    <bp-button class='one'>Title</bp-button>
    #{hText}
    <bp-button class='two'>Other</bp-button>
    Bar
    <bp-button class='three'>Three</bp-button>
  </bp-navbar>"
  element = @$compile(navbarTemplate) @$scope
  equal element.attr('role'), 'navigation', 'role is navigation'

  $navbarText = element.children('.bp-navbar-text')
  ok $navbarText.length, 'navbar text is child'
  equal $navbarText.attr('role'), 'heading', 'navbar text has role heading'
  equal $navbarText.text(), "#{hText} Bar", "navbar text is #{hText}"

  $buttons = element.children('bp-button')
  equal $buttons.length, 3, 'two buttons in navbar'
  ok $buttons.filter('.one').hasClass('before'), 'first button has .before'
  ok $buttons.filter('.two').hasClass('before'), 'second button has .after'
  ok $buttons.filter('.three').hasClass('after'), 'third button has .before'
