describe('navbarDirective', function() {
  describe('ios', function() {
    var element, scope, state, timeout, title;
    scope = null;
    state = null;
    timeout = null;
    element = null;
    title = null;
    beforeEach(module('bp'));
    beforeEach(module(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/first');
      $stateProvider.state('first', {
        url: '/first',
        data: {
          up: 'second'
        }
      }).state('second', {
        url: '/second'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile, $state, $timeout) {
      scope = $rootScope.$new();
      state = $state;
      timeout = $timeout;
      state.transitionTo('first');
      timeout.flush();
      element = $compile("<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>")(scope);
      title = element.find('bp-navbar-title');
      return scope.$apply();
    }));
    describe('controller', function() {
      it('should getTitleFromState', function() {
        var childScope, stateTitle;
        childScope = title.scope();
        stateTitle = childScope.getTitleFromState({
          data: {
            title: 'Foo'
          }
        });
        expect(stateTitle).toBe('Foo');
        stateTitle = childScope.getTitleFromState({
          name: 'Bar'
        });
        expect(stateTitle).toBe('Bar');
        stateTitle = childScope.getTitleFromState({
          name: 'Buz',
          data: {
            title: 'Baz'
          }
        });
        return expect(stateTitle).toBe('Baz');
      });
      return it('should convertActionToIcon', function() {
        var $action, childScope;
        childScope = title.scope();
        $action = angular.element('<bp-action class="bp-button">Yo</bp-action>');
        childScope.convertActionToIcon($action);
        expect($action.text()).toBe('');
        expect($action.hasClass('bp-button')).toBe(false);
        expect($action.hasClass('bp-icon')).toBe(true);
        return expect($action.attr('aria-label')).toBe('Yo');
      });
    });
    return describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('navigation');
        return expect(title.attr('role')).toBe('heading');
      });
      it('should apply title', function() {
        return expect(title.text()).toBe('First');
      });
      it('should place up button', function() {
        var $up;
        $up = element.find('.bp-action-up');
        return expect($up.text()).toBe('Second');
      });
      it('should apply buttons', function() {
        expect(element.find('bp-action').hasClass('bp-button')).toBe(true);
        return expect(element.children().length).toBe(4);
      });
      it('should calculate center', inject(function($window) {
        var $spacer;
        angular.element('body').append(element);
        timeout.flush();
        expect(element.children().length).toBe(5);
        $spacer = element.find('div');
        expect($spacer.attr('style')).toMatch(/width/);
        expect($spacer.attr('style')).toMatch(/flex/);
        expect(element.children().get(2)).toBe($spacer.get(0));
        return element.detach();
      }));
      it('should allow icons in navbar', inject(function($compile) {
        var $icon, element2;
        element2 = $compile("<bp-navbar bp-navbar-no-up bp-navbar-title> <bp-action class='bp-icon'>Action</bp-action> </bp-navbar>")(scope);
        $icon = element2.find('bp-action');
        expect($icon.hasClass('bp-button')).toBe(false);
        expect($icon.hasClass('bp-icon')).toBe(true);
        return expect($icon.attr('aria-label')).toBe('Action');
      }));
      return it('should spawn toolbar', inject(function($compile) {
        var element3;
        element3 = $compile("<bp-navbar> <bp-action>First</bp-action> <bp-action>Second</bp-action> <bp-action>Third</bp-action> </bp-navbar>")(scope);
        expect(element3.next().is('bp-toolbar')).toBe(true);
        return expect(element3.next().children().length).toBe(3);
      }));
    });
  });
  return describe('android', function() {
    var compile, element, scope, state, timeout;
    scope = null;
    state = null;
    timeout = null;
    element = null;
    compile = null;
    beforeEach(module('bp', function(bpConfigProvider) {
      bpConfigProvider.setConfig({
        platform: 'android'
      });
      return null;
    }));
    beforeEach(module(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/first');
      $stateProvider.state('first', {
        url: '/first',
        data: {
          up: 'second'
        }
      }).state('second', {
        url: '/second'
      });
      return null;
    }));
    beforeEach(inject(function($rootScope, $compile, $state, $timeout) {
      compile = $compile;
      scope = $rootScope.$new();
      state = $state;
      timeout = $timeout;
      state.transitionTo('first');
      timeout.flush();
      element = $compile("<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>")(scope);
      return scope.$apply();
    }));
    return describe('element', function() {
      it('should apply icons', function() {
        var $icons;
        $icons = element.find('.bp-icon');
        expect($icons.length).toBe(2);
        expect($icons.eq(1).attr('aria-label')).toBe('Action');
        expect(element.find('.bp-action-up').length).toBe(1);
        expect(element.children().length).toBe(3);
        return expect(element.find('bp-navbar-icon').length).toBe(1);
      });
      it('should handle navbar icons', function() {
        var element2;
        state.transitionTo('second');
        timeout.flush();
        element2 = compile("<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>")(scope);
        expect(element2.children().length).toBe(3);
        return expect(element2.find('bp-navbar-icon').length).toBe(1);
      });
      return it('should spawn action overflow', function() {
        var element3;
        element3 = compile("<bp-navbar> <bp-action>First</bp-action> <bp-action>Second</bp-action> <bp-action>Third</bp-action> </bp-navbar>")(scope);
        expect(element3.children().length).toBe(5);
        return expect(element3.find('bp-action-overflow').length).toBe(1);
      });
    });
  });
});
