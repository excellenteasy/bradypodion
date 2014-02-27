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

  var fooState = {
    name: 'foostate',
    url: '/foourl'
  }

  var barState = {
    name: 'barstate',
    url: '/barurl'
  }

  beforeEach(module('bp', function(bpConfigProvider) {
    bpConfigProvider.setConfig({
      platform: 'ios'
    })
  }))

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new()
    element = $compile('<div bp-navigation>')(scope)
    ctrl = element.controller('bpNavigation')
  }))

  describe('controller', function() {
    it('should register and create navbar', function() {

      ctrl.registerNavbar(attrs,$actions,fooState, scope)

      var navbarConfig = scope.bpNavbarConfig.foostate
      expect(angular.isObject(navbarConfig)).toBe(true)
      expect(navbarConfig.$actions).toBe($actions)
      expect(navbarConfig.attrs).toEqual({
        'foo-bar': 'foo'
      })
      expect(navbarConfig.noNavbar).toBe(false)
      expect(navbarConfig.scope).toBe(scope)
    })
  })

  describe('link', function() {
    it('should create navbar', function() {
      ctrl.registerNavbar(attrs,$actions,fooState)
      scope.$broadcast('$stateChangeSuccess', fooState, null, barState)
      var $navbar = element.children('bp-navbar-wrapper').children()
      expect($navbar.attr('foo-bar')).toBe('foo')
      expect($navbar.children('bp-action').length).toBe(1)
    })
    it('should remove old navbar', inject(function($timeout, bpConfig) {
      angular.element('body').append(element)
      scope.$broadcast('$stateChangeSuccess', fooState, null, barState)
      var $navbar = element.children('bp-navbar-wrapper').children()
      expect($.contains(document, $navbar.get(0))).toBe(true)
      scope.$broadcast('$stateChangeSuccess', barState, null, fooState)
      $timeout.flush()
      expect($.contains(document, $navbar.get(0))).toBe(false)
      $navbar = element.children('bp-navbar-wrapper').children()
      bpConfig.setConfig({platform: 'android'})
      scope.$broadcast('$stateChangeSuccess', fooState, null, barState)
      expect($.contains(document, $navbar.get(0))).toBe(false)
    }))
  })
})
