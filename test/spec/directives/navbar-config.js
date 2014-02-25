describe('navbarConfig', function() {
  beforeEach(module('bp'))

  it('should be removed from DOM', inject(function($rootScope, $compile) {

    var $config = angular.element('<bp-navbar-config>')
    var $element = angular.element('<div bp-navigation></div>')
      .append($config)

    angular.element('body').append($element)
    expect($.contains(document, $config.get(0))).toBe(true)

    $compile($element)($rootScope)
    expect($.contains(document, $config.get(0))).toBe(false)
  }))
})
