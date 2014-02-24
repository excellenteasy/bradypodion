describe('navbarConfig', function() {
  beforeEach(module('bp'))

  it('should be removed from DOM', inject(function($rootScope, $compile) {

    element = angular.element('<div bp-navigation></div>')
      .append(angular.element(('<bp-navbar-config>')))

    angular.element('body').append(element)
    expect($.contains(document, element.children().get(0))).toBe(true)

    $compile(element)($rootScope)
    expect($.contains(document, element.children().get(0))).toBe(false)

  }))
})
