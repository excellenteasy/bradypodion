describe('navbarDirective', function() {
  describe('ios', function() {
    var element, scope, state, ctrl, timeout, title

    beforeEach(module('bp'))

    beforeEach(module(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/first')
      $stateProvider.state('first', {
        url: '/first',
        data: {
          up: 'second'
        }
      }).state('second', {
        url: '/first/second'
      }).state('third', {
        url: '/third',
        data: {
          up: 'first({foo: 1})'
        }
      })

    }))

    beforeEach(inject(function($rootScope, $compile, $state, $timeout) {
      scope = $rootScope.$new()
      state = $state
      timeout = $timeout
      state.transitionTo('first')
      timeout.flush()
      element = $compile('<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>')(scope)
      title = element.find('bp-navbar-title')
      ctrl = element.controller('bpNavbar')
      scope.$apply()
    }))

    describe('controller', function() {
      it('should getTitleFromState', function() {
        var stateTitle = ctrl.getTitleFromState({
          data: {
            title: 'Foo'
          }
        })
        expect(stateTitle).toBe('Foo')
        stateTitle = ctrl.getTitleFromState({
          name: 'Bar'
        })
        expect(stateTitle).toBe('Bar')
        stateTitle = ctrl.getTitleFromState({
          name: 'Buz',
          data: {
            title: 'Baz'
          }
        })
        expect(stateTitle).toBe('Baz')
      })

      it('should convertActionToIcon', function() {
        var $action = angular.element('<bp-action class="bp-button">Yo</bp-action>')
        ctrl.convertActionToIcon($action)
        expect($action.text()).toBe('')
        expect($action.hasClass('bp-button')).toBe(false)
        expect($action.hasClass('bp-icon')).toBe(true)
        expect($action.attr('aria-label')).toBe('Yo')
      })
    })

    describe('element', function() {
      it('should have ARIA role', function() {
        expect(element.attr('role')).toBe('navigation')
        expect(title.attr('role')).toBe('heading')
      })

      it('should apply title', function() {
        expect(title.text()).toBe('First')
      })

      it('should place up button', function() {
        var $up = element.find('.bp-action-up')
        expect($up.text()).toBe('Second')
      })

      it('should apply buttons', function() {
        expect(element.find('bp-action').hasClass('bp-button')).toBe(true)
        expect(element.children().length).toBe(4)
      })

      it('should calculate center', function() {
        angular.element('body').append(element)
        timeout.flush()
        expect(element.children().length).toBe(5)
        var $spacer = element.find('div')
        expect($spacer.attr('style')).toMatch(/width/)
        expect($spacer.attr('style')).toMatch(/flex/)
        expect(element.children().get(2)).toBe($spacer.get(0))
        element.detach()
      })

      it('should allow icons in navbar', inject(function($compile) {
        var element2 = $compile('<bp-navbar bp-navbar-no-up bp-navbar-title> <bp-action class="bp-icon">Action</bp-action> </bp-navbar>')(scope)
        var $icon = element2.find('bp-action')
        expect($icon.hasClass('bp-button')).toBe(false)
        expect($icon.hasClass('bp-icon')).toBe(true)
        expect($icon.attr('aria-label')).toBe('Action')
      }))

      it('should spawn toolbar', inject(function($compile) {
        var element3 = $compile('<bp-navbar> <bp-action>First</bp-action> <bp-action>Second</bp-action> <bp-action>Third</bp-action> </bp-navbar>')(scope)
        expect(element3.next().is('bp-toolbar')).toBe(true)
        expect(element3.next().children().length).toBe(3)
      }))

      it('should remove toolbar on destroy', inject(function($compile) {
        var element4 = angular.element('<bp-navbar> <bp-action>First</bp-action> <bp-action>Second</bp-action> <bp-action>Third</bp-action> </bp-navbar>')
        angular.element('body').append(element4)
        $compile(element4)(scope)
        expect($.contains(document, element4.next().get(0))).toBe(true)
        element4.trigger('$destroy')
        expect($.contains(document, element4.next().get(0))).toBe(false)
      }))

      it('should parse state up (w/ params)', inject(function($compile) {
        state.go('third')
        timeout.flush()
        var element5 = $compile(angular.element('<bp-navbar>'))(scope)
        var $up = element5.find('.bp-action-up')

        expect($up.text()).toBe('First')
        expect($up.attr('bp-sref')).toBe('first({foo: 1})')
        state.go('second')
        timeout.flush()
        var element6 = $compile(angular.element('<bp-navbar>'))(scope)
        $up = element6.find('.bp-action-up')

        expect($up.text()).toBe('First')
        expect($up.attr('bp-sref')).toBe('first')

      }))
    })
  })
  describe('android', function() {
    var compile, element, scope, state, timeout

    beforeEach(module('bp', function(bpAppProvider) {
      bpAppProvider.setConfig({
        platform: 'android'
      })
    }))

    beforeEach(module(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/first')
      $stateProvider.state('first', {
        url: '/first',
        data: {
          up: 'second'
        }
      }).state('second', {
        url: '/second'
      })
    }))

    beforeEach(inject(function($rootScope, $compile, $state, $timeout) {
      compile = $compile
      scope = $rootScope.$new()
      state = $state
      timeout = $timeout
      state.transitionTo('first')
      timeout.flush()
      element = $compile('<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>')(scope)
      scope.$apply()
    }))

    describe('element', function() {
      it('should apply icons', function() {
        var $icons = element.find('.bp-icon')
        expect($icons.length).toBe(2)
        expect($icons.eq(1).attr('aria-label')).toBe('Action')
        expect(element.find('.bp-action-up').length).toBe(1)
        expect(element.children().length).toBe(3)
        expect(element.find('bp-navbar-icon').length).toBe(1)
      })

      it('should handle navbar icons', function() {
        state.transitionTo('second')
        timeout.flush()
        var element2 = compile('<bp-navbar> <bp-action>Action</bp-action> </bp-navbar>')(scope)
        expect(element2.children().length).toBe(3)
        expect(element2.find('bp-navbar-icon').length).toBe(1)
      })

      it('should spawn action overflow', function() {
        var element3 = compile('<bp-navbar> <bp-action>First</bp-action> <bp-action>Second</bp-action> <bp-action>Third</bp-action> </bp-navbar>')(scope)
        expect(element3.children().length).toBe(5)
        expect(element3.find('bp-action-overflow').length).toBe(1)
      })
    })
  })
})
