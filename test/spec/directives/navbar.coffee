describe 'navbarDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope = $rootScope.$new()
    template = "<bp-navbar bp-navbar-title='Foo'>
        <bp-action class='one'>Title</bp-action>
        <bp-action class='two'>Other</bp-action>
      </bp-navbar>"
    element = $compile(template) scope
    scope.$apply()

  describe 'element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'navigation'

  describe 'title', ->
    it 'should have ARIA role', ->
      $text = element.find 'bp-navbar-title'
      expect($text.attr 'role' ).toBe 'heading'

    it 'should be applied', ->
      $text = element.find 'bp-navbar-title'
      expect($text.text()).toBe 'Foo'
      expect($text.scope().bpNavbarTitle).toBe 'Foo'

  describe 'actions', ->
    it 'should have correct type', ->
      $actions = element.find('bp-action')
      expect($actions.length).toBe 2
      expect($actions.eq(0).is '.bp-button.one' ).toBe true
      expect($actions.eq(1).is '.bp-button.two' ).toBe true
