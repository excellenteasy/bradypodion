describe('srefDirective', function() {
  var element, scope, state;
  element = null;
  scope = null;
  state = null;
  beforeEach(module('bp'));
  beforeEach(module(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/first');
    $stateProvider.state('first', {
      url: '/first'
    }).state('second', {
      url: '/second'
    });
    return null;
  }));
  beforeEach(inject(function($rootScope, $compile, $state) {
    scope = $rootScope.$new();
    state = $state;
    element = $compile('<li bp-sref="second"></li>')(scope);
    return scope.$apply();
  }));
  return describe('events', function() {
    it('should bind tap', function() {
      var events;
      events = $._data(element.get(0)).events;
      return expect(events.tap != null).toBe(true);
    });
    it('should change state on tap', inject(function($timeout) {
      element.trigger('tap');
      $timeout.flush();
      return expect(state.$current.name).toBe('second');
    }));
    return it('should unbind tap after destroy', function() {
      var events;
      events = $._data(element.get(0)).events;
      scope.$destroy();
      return expect(events.tap != null).toBe(false);
    });
  });
});
