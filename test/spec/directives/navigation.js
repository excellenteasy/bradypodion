describe('navigation',function() {
  var scope, element, ctrl

  var attrs = {
    $attr: {
      fooBar: 'foo-bar'
    },
    fooBar: 'foo'
  }
  var $actions = angular.element('<bp-action>')
    .text('Action')

  var state = {
    name: 'foostate'
  }

  beforeEach(module('bp'))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<div bp-navigation>')(scope)
    ctrl = element.controller('bpNavigation')
  }))

  describe('controller', function() {
    it('should register and creat navbar', function() {

      ctrl.registerNavbar(attrs,$actions,state)

      var navbarConfig = scope.bpNavbarConfig.foostate
      expect(angular.isObject(navbarConfig)).toBe(true)
      expect(navbarConfig.$actions).toBe($actions)
      expect(navbarConfig.attrs).toEqual({
        'foo-bar': 'foo'
      })
      expect(navbarConfig.noNavbar).toBe(false)
    })
  })

  describe('link', function() {
    it('should create navbar', function() {
      ctrl.registerNavbar(attrs,$actions,state)
      scope.$broadcast('$stateChangeSuccess',state)
      var $navbar = element.children()
      expect($navbar.attr('foo-bar')).toBe('foo')
      expect($navbar.children('bp-action').length).toBe(1)
    })
    it('should remove old navbar', function() {
      angular.element('body').append(element)
      scope.$broadcast('$stateChangeSuccess',state)
      var $navbar = element.children()
      expect($.contains(document, $navbar.get(0))).toBe(true)
      scope.$broadcast('$stateChangeSuccess',{name: 'barstate'})
      expect($.contains(document, $navbar.get(0))).toBe(false)
    })
  })
})
