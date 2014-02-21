describe('tabbarDirective', function() {
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
      url: '/second',
      data: {
        title: 'Custom'
      }
    });
    return null;
  }));
  beforeEach(inject(function($rootScope, $compile, $state) {
    var template;
    scope = $rootScope.$new();
    state = $state;
    template = "<bp-tabbar> <bp-tab bp-sref='first' bp-tab-icon='bp-icon-search'></bp-tab> <bp-tab bp-sref='second' bp-tab-icon='bp-icon-search'></bp-tab> </bp-tabbar>";
    element = $compile(template)(scope);
    return scope.$apply();
  }));
  describe('tabbar element', function() {
    return it('should have ARIA role', function() {
      return expect(element.attr('role')).toBe('tablist');
    });
  });
  describe('tab elements', function() {
    it('should have correct name', function() {
      expect(element.children().eq(0).text()).toBe('First');
      return expect(element.children().eq(1).text()).toBe('Custom');
    });
    it('should have ARIA role', function() {
      return element.children().each(function(i, element) {
        return expect($(element).attr('role')).toBe('tab');
      });
    });
    return it('should assign `bp-tab-active` class', inject(function($timeout) {
      var $first, $second;
      $first = element.find(':first-child');
      $second = element.find(':nth-child(2)');
      expect($first.hasClass('bp-tab-active')).toBe(true);
      expect($second.hasClass('bp-tab-active')).toBe(false);
      state.transitionTo('second');
      $timeout.flush();
      expect($first.hasClass('bp-tab-active')).toBe(false);
      return expect($second.hasClass('bp-tab-active')).toBe(true);
    }));
  });
  return describe('events', function() {
    it('should bind touchstart', function() {
      var events;
      events = $._data(element.children().get(0)).events;
      return expect(events.touchstart != null).toBe(true);
    });
    it('should change state 500ms after touchstart', inject(function($timeout) {
      element.children().eq(1).trigger('touchstart');
      $timeout.flush();
      return expect(state.$current.name).toBe('second');
    }));
    return it('should unbind touchstart after destroy', function() {
      var events;
      events = $._data(element.children().get(0)).events;
      scope.$destroy();
      return expect(events.touchstart != null).toBe(false);
    });
  });
});
