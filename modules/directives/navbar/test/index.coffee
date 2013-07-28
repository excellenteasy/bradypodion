describe 'navbarDirective', ->

  scope   = null
  element = null

  beforeEach module 'bp'

  beforeEach inject ($rootScope, $compile) ->
    scope = $rootScope.$new()
    template = "<bp-navbar>
        <bp-button class='one'>Title</bp-button>
        {{ label }}
        <bp-button class='two'>Other</bp-button>
        Bar
        <bp-button class='three'>Three</bp-button>
      </bp-navbar>"
    element = $compile(template) scope
    scope.$apply()

  describe 'element', ->
    it 'should have ARIA role', ->
      expect(element.attr 'role' ).toBe 'navigation'

  describe 'text', ->
    it 'should have ARIA role', ->
      $text = element.find '.bp-navbar-text'
      expect($text.attr 'role' ).toBe 'heading'

    # it 'should be compiled', ->
    #   $text = element.find '.bp-navbar-text'
    #   expect($text.text()).toBe ' Bar'
    #   scope.label = 'Foo'
    #   scope.$apply()
    #   $text = element.find '.bp-navbar-text'
    #   expect($text.text()).toBe 'Foo Bar'

  describe 'buttons', ->
    it 'should have correct order', ->
      $buttons = element.children('bp-button')
      expect($buttons.length).toBe 3
      expect($buttons.filter('.one').hasClass 'before' ).toBe true
      expect($buttons.filter('.two').hasClass 'before' ).toBe true
      expect($buttons.filter('.three').hasClass 'after' ).toBe true
