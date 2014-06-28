/*!
 * Bradypodion v0.5.2
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Released under the MIT license.
 *
 * Date: 2014-06-28T12:19:18
 */
(function () {
  'use strict';
  angular.module('bp.util', []);
  angular.module('bp', [
    'bp.util',
    'ngAnimate',
    'ngTouch',
    'ui.router'
  ]);
  angular.module('bp').directive('bpActionOverflow', [
    '$window',
    'bpApp',
    function ($window, bpApp) {
      return {
        restrict: 'E',
        transclude: true,
        controller: [
          '$animate',
          function ($animate) {
            this.open = function ($menu) {
              $menu.attr('aria-hidden', 'false');
              $animate.addClass($menu, 'bp-action-overflow-open');
            };
            this.close = function ($menu) {
              $menu.attr('aria-hidden', 'true');
              $animate.removeClass($menu, 'bp-action-overflow-open');
            };
          }
        ],
        replace: true,
        template: '<bp-action-overflow-wrapper ng-click></bp-action-overflow-wrapper>',
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element, attrs, ctrl) {
            if (bpApp.platform === 'ios') {
              element.attr('aria-hidden', 'true');
              return;
            }
            element.attr({
              role: attrs.role || 'button',
              'aria-has-popup': 'true'
            });
            var open = false;
            var dismiss = false;
            transcludeFn(scope, function (clone) {
              var $actions = clone.filter('bp-action');
              $actions.each(function () {
                var $action = angular.element(this);
                $action.attr('role', 'menu-item').addClass('bp-button');
              });
              var $menu = angular.element('<bp-action-overflow-menu>').attr({
                  role: 'menu',
                  'aria-hidden': 'true'
                }).append($actions);
              var $$window = angular.element($window);
              element.append($menu);
              element.on('click', function () {
                if (open) {
                  ctrl.close($menu);
                  open = false;
                }
                if (!dismiss) {
                  ctrl.open($menu);
                  open = true;
                }
                dismiss = false;
              });
              $actions.on('touchstart mousedown click', function (e) {
                e.stopPropagation();
              });
              $$window.on('touchstart mousedown', function (e) {
                if (open) {
                  ctrl.close($menu);
                  open = false;
                  if (element.is(e.target) || $menu.is(e.target)) {
                    dismiss = true;
                  }
                }
              });
              scope.$on('$destroy', function () {
                element.unbind('click');
                $actions.unbind('touchstart mousedown click');
                $$window.unbind('touchstart mousedown');
              });
            });
          };
        }
      };
    }
  ]);
  angular.module('bp').directive('bpAction', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        if (angular.isUndefined(attrs.role)) {
          element.attr('role', 'button');
        }
      }
    };
  });
  angular.module('bp').directive('bpApp', [
    '$compile',
    'bpApp',
    function ($compile, bpApp) {
      return {
        restrict: 'AE',
        controller: [
          'bpView',
          function (bpView) {
            this.onStateChangeStart = function (event, toState, toParams, fromState) {
              var direction = toParams.direction || bpView.getDirection(fromState, toState);
              var type = toParams.transition || bpView.getType(fromState, toState, direction);
              this.setTransition(type, direction);
            };
            this.onViewContentLoaded = function () {
              var $views = angular.element('[ui-view], ui-view');
              if (!angular.isString(this.transition)) {
                $views.removeClass(this.lastTransition);
                return;
              }
              $views.removeClass(this.lastTransition).addClass(this.transition);
              this.lastTransition = this.transition;
            };
            this.setTransition = function (type, direction) {
              if (angular.isString(type) && angular.isString(direction)) {
                this.transition = type + '-' + direction;
                return;
              }
              this.transition = null;
            };
            this.onViewContentLoaded = angular.bind(this, this.onViewContentLoaded);
            this.onStateChangeStart = angular.bind(this, this.onStateChangeStart);
            return this;
          }
        ],
        link: function (scope, element, attrs, ctrl) {
          scope.$on('$stateChangeStart', ctrl.onStateChangeStart);
          scope.$on('$viewContentLoaded', ctrl.onViewContentLoaded);
          element.addClass(bpApp.platform).attr('role', attrs.role || 'application');
        }
      };
    }
  ]);
  angular.module('bp').directive('bpCell', function () {
    return {
      restrict: 'E',
      priority: 10,
      transclude: true,
      compile: function (elem, attrs, transcludeFn) {
        return function (scope, element) {
          transcludeFn(scope, function (clone) {
            element.attr('role', attrs.role || 'listitem').append(clone);
          });
        };
      }
    };
  });
  angular.module('bp').directive('bpDetailDisclosure', [
    'bpApp',
    '$rootScope',
    function (bpApp, $rootScope) {
      return {
        restrict: 'E',
        link: function (scope, element, attrs) {
          if (bpApp.platform === 'android') {
            element.attr('aria-hidden', 'true');
            return;
          }
          var uniqueId = attrs.ariaDescribedby;
          if (!uniqueId) {
            var $parent = element.parent();
            if (!(uniqueId = $parent.attr('id'))) {
              if (angular.isUndefined($rootScope._uniqueId)) {
                $rootScope._uniqueId = 0;
              }
              uniqueId = 'bp_' + $rootScope._uniqueId++;
              $parent.attr('id', uniqueId);
            }
          }
          element.attr({
            'aria-describedby': uniqueId,
            'aria-label': attrs.ariaLabel || 'More Info',
            role: attrs.role || 'button'
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpNavbarConfig', [
    '$state',
    function ($state) {
      return {
        restrict: 'E',
        require: '^bpNavigation',
        transclude: true,
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element, attrs, ctrl) {
            transcludeFn(scope, function (clone) {
              ctrl.registerNavbar(attrs, clone, $state.current, scope);
              element.remove();
            });
          };
        }
      };
    }
  ]);
  angular.module('bp').directive('bpNavbar', [
    'bpApp',
    'bpView',
    '$timeout',
    '$state',
    '$compile',
    '$log',
    '$urlMatcherFactory',
    function (bpApp, bpView, $timeout, $state, $compile, $log, $urlMatcherFactory) {
      return {
        restrict: 'E',
        transclude: true,
        controller: function () {
          this.getTitleFromState = function (state) {
            if (angular.isObject(state.data) && angular.isString(state.data.title)) {
              return state.data.title;
            }
            return state.name.charAt(0).toUpperCase() + state.name.slice(1);
          };
          this._getUpFromStateByUrl = function (state) {
            var up = {};
            var wantedUrl = bpView._getURLSegments(state).slice(0, -1).join('/');
            var states = $state.get();
            for (var i = states.length - 1; i >= 0; i--) {
              if (states[i] !== state && wantedUrl === states[i].url) {
                up.sref = states[i].name;
                up.state = states[i];
                break;
              }
            }
            return up;
          };
          this.getUpFromState = function (state) {
            var up = {};
            if (angular.isObject(state.data) && angular.isString(state.data.up)) {
              up.sref = state.data.up;
            } else {
              if (state.url) {
                up = this._getUpFromStateByUrl(state);
              }
            }
            if (!up.sref) {
              return null;
            }
            if (!up.state && up.sref) {
              up.state = $state.get(bpView.parseState(up.sref).state);
            }
            if (!up.state) {
              $log.error('up state detection failed. No up button compiled. Check your state configuration.');
              return null;
            }
            var params = $urlMatcherFactory.compile(up.state.url).params;
            if (!params.length) {
              return up;
            }
            for (var k = params.length - 1; k >= 0; k--) {
              if (angular.isUndefined($state.params[params[k]])) {
                $log.error('A parameter defined in the up state\'s url is not in the current state params. Check your state configuration.');
              }
            }
            up.sref += '(' + angular.toJson($state.params) + ')';
            return up;
          };
          this.convertActionToIcon = function ($action) {
            if (angular.isElement($action)) {
              var label = $action.attr('aria-label') || $action.text();
              $action.attr('aria-label', label).text('').removeClass('bp-button').addClass('bp-icon');
            }
          };
        },
        compile: function (elem, attrs, transcludeFn) {
          var ios = bpApp.platform === 'android' ? false : true;
          return function (scope, element, attrs, ctrl) {
            var state = $state.current;
            element.attr('role', attrs.role || 'navigation');
            transcludeFn(scope, function (clone) {
              var $actions = clone.filter('bp-action');
              var title = attrs.bpNavbarTitle;
              if (angular.isUndefined(title)) {
                title = ctrl.getTitleFromState(state);
              }
              var $title = $compile(angular.element('<bp-navbar-title>').attr('role', 'heading').text(title))(scope);
              var $up;
              if (angular.isUndefined(attrs.bpNavbarNoUp)) {
                var up = ctrl.getUpFromState(state);
                if (up) {
                  $up = $compile(angular.element('<bp-action>').addClass('bp-action-up').attr('ui-sref', up.sref).text(ctrl.getTitleFromState(up.state)))(scope);
                }
              }
              var $frstAction, $scndAction, $toolbar;
              if (!ios) {
                var $icon = angular.element('<bp-navbar-icon>');
                $frstAction = $actions.eq(0);
                $scndAction = $actions.eq(1);
                ctrl.convertActionToIcon($frstAction);
                ctrl.convertActionToIcon($scndAction);
                ctrl.convertActionToIcon($up);
                if ($actions.length > 2) {
                  $toolbar = $compile(angular.element('<bp-action-overflow>').append($actions.not($frstAction).not($scndAction)))(scope);
                }
                if (angular.isElement($up)) {
                  $up.append('<div>', $icon);
                  element.append($up, $title, $frstAction, $scndAction, $toolbar);
                  return;
                }
                element.append($icon, $title, $frstAction, $scndAction, $toolbar);
                return;
              }
              var $arrow;
              var actionsCount = $actions.length;
              if (angular.isElement($up)) {
                $arrow = angular.element('<bp-button-up>');
                $frstAction = $up.addClass('bp-button');
              }
              if ($frstAction && actionsCount > 1 || !$frstAction && actionsCount > 2) {
                $actions.each(function () {
                  ctrl.convertActionToIcon(angular.element(this));
                });
                $toolbar = angular.element('<bp-toolbar>').append($actions);
              } else {
                if (actionsCount === 1 || $frstAction) {
                  $scndAction = $actions.eq(0);
                } else {
                  $frstAction = $actions.eq(0);
                  $scndAction = $actions.eq(1);
                }
                $actions.each(function () {
                  var $action = angular.element(this);
                  if ($action.hasClass('bp-icon')) {
                    ctrl.convertActionToIcon($action);
                  } else {
                    $action.addClass('bp-button');
                  }
                });
              }
              element.append($frstAction, $title, $scndAction, $arrow);
              if ($toolbar && angular.element.contains(document, element[0])) {
                element.after($toolbar);
              } else {
                $timeout(function () {
                  element.parent().siblings().find('[ui-view]').append($toolbar);
                }, 0);
              }
              if (angular.isElement($toolbar)) {
                element.on('$destroy', function () {
                  $toolbar.remove();
                });
              }
              if (!scope.navbarTitle) {
                $timeout(function () {
                  var frstW = angular.isElement($scndAction) ? $scndAction.outerWidth() : 0;
                  var scndW = angular.isElement($frstAction) ? $frstAction.outerWidth() : 0;
                  var diff = frstW - scndW;
                  if (diff !== 0) {
                    angular.element('<div>').css({
                      '-webkit-box-flex': '10',
                      'max-width': Math.abs(diff)
                    })[diff > 0 ? 'insertBefore' : 'insertAfter']($title);
                  }
                }, 0, false);
              }
            });
          };
        }
      };
    }
  ]);
  angular.module('bp').directive('bpNavigation', [
    '$state',
    '$compile',
    '$animate',
    'bpView',
    'bpApp',
    function ($state, $compile, $animate, bpView, bpApp) {
      return {
        controller: function () {
          this.configs = {};
          this.registerNavbar = function (attrs, $actions, state, scope) {
            var attrsHash = {};
            if (angular.isObject(attrs) && angular.isObject(attrs.$attr)) {
              for (var attr in attrs.$attr) {
                attrsHash[attrs.$attr[attr]] = attrs[attr];
              }
            }
            this.configs[state.name] = {
              $actions: $actions,
              attrs: attrsHash,
              noNavbar: angular.isDefined(attrs.bpNavbarNoNavbar) ? true : false,
              scope: scope
            };
          };
        },
        link: function (scope, element, attrs, ctrl) {
          var $wrapper = angular.element('<bp-navbar-wrapper>');
          var $oldNavbar;
          element.prepend($wrapper);
          scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            var $navbar = angular.element();
            var navbarConfig = ctrl.configs[toState.name] || {};
            var direction = bpView.getDirection(fromState, toState);
            var isSlide = bpView.getType(fromState, toState, direction) === 'slide';
            var isIos = bpApp.platform === 'ios';
            if (!navbarConfig.noNavbar) {
              $wrapper.show();
              $navbar = angular.element('<bp-navbar>').append(navbarConfig.$actions).attr(navbarConfig.attrs || {});
              if (angular.isDefined(navbarConfig.scope)) {
                $compile($navbar)(navbarConfig.scope);
              } else {
                $compile($navbar)(scope);
              }
            } else {
              $wrapper.hide();
            }
            delete ctrl.configs[toState.name];
            if (isIos && isSlide && direction && angular.isElement($oldNavbar)) {
              var animation = 'bp-navbar-' + direction;
              $animate.enter($navbar.addClass(animation), $wrapper, null, function () {
                $navbar.removeClass(animation);
              });
              $animate.leave($oldNavbar.addClass(animation));
            } else {
              $wrapper.append($navbar);
              if (angular.isElement($oldNavbar)) {
                $oldNavbar.remove();
              }
            }
            $oldNavbar = $navbar;
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpScroll', function () {
    return function (scope, element) {
      element.bind('touchstart', angular.noop);
      scope.$on('$destroy', function () {
        element.unbind('touchstart');
      });
    };
  });
  angular.module('bp').directive('bpSearch', [
    '$compile',
    '$timeout',
    '$window',
    'bpApp',
    function ($compile, $timeout, $window, bpApp) {
      return {
        restrict: 'E',
        link: function (scope, element, attrs) {
          var ios = bpApp.platform === 'ios';
          var childScope = scope.$new(true);
          var $bgLeft, $bgRight, $cancel;
          if (ios) {
            $bgLeft = angular.element('<bp-search-bg-left>');
            $bgRight = angular.element('<bp-search-bg-right>');
            $cancel = $compile(angular.element('<bp-action>').addClass('bp-button').attr('ng-click', 'onCancel()').text('Cancel'))(childScope);
          }
          var $placeholder = $compile(angular.element('<bp-search-placeholder>').append(angular.element('<bp-action>').addClass('bp-icon bp-icon-search')).append(angular.element('<span>').attr('ng-bind', 'placeholder')))(childScope);
          var $tapLayer = $compile(angular.element('<bp-search-tap>').attr('ng-click', 'onFocus()'))(childScope);
          var $search = element.find('input');
          $search.attr({
            required: 'required',
            type: $search.attr('type') || 'search'
          });
          childScope.placeholder = $search.attr('placeholder');
          if (childScope.placeholder == null) {
            childScope.placeholder = 'Search';
          }
          element.attr('role', attrs.role || 'search').prepend($bgLeft, $bgRight).append($placeholder, $cancel, $tapLayer);
          if (ios) {
            var cancelWidth;
            $timeout(function () {
              var width = element.outerWidth();
              cancelWidth = $cancel.outerWidth();
              var inputWidth = width - cancelWidth - 6;
              var iconWidth = $placeholder.find('.bp-icon').outerWidth();
              $bgLeft.css('width', inputWidth);
              $bgRight.css('width', cancelWidth);
              $search.css({
                width: inputWidth,
                'padding-left': 1.5 * iconWidth
              });
            }, 50, false);
            childScope.onResize = function () {
              var inputWidth = element.outerWidth() - cancelWidth;
              $bgLeft.css('width', inputWidth);
            };
            childScope.onCancel = function () {
              element.removeClass('focus');
              $search.val('').trigger('input').trigger('blur', { programatic: true });
            };
          }
          childScope.onBlur = function (e, extra) {
            if (angular.isUndefined(extra)) {
              extra = {};
            }
            if (!ios) {
              element.removeClass('focus');
            } else {
              if (!$search.val() && !extra.programatic) {
                childScope.onCancel();
              }
            }
          };
          childScope.onFocus = function () {
            $search.focus();
            $timeout(function () {
              element.addClass('focus');
            }, 0);
          };
          childScope.stopPropagation = function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
          };
          if (ios) {
            angular.element($window).bind('resize orientationchange', childScope.onResize);
          }
          $search.bind('blur', childScope.onBlur);
          $tapLayer.bind('click touchstart touchmove touchend', childScope.stopPropagation);
          scope.$on('$destroy', function () {
            childScope.$destroy();
            if (ios) {
              angular.element($window).unbind('resize orientationchange');
            }
            $tapLayer.unbind('click touchstart touchmove touchend');
            $search.unbind('blur');
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('uiSref', [
    '$injector',
    function ($injector) {
      return {
        compile: function (e, attrs) {
          if (angular.isDefined(attrs.ngClick)) {
            return;
          }
          return $injector.get('ngClickDirective')[0].compile.apply(this, arguments);
        }
      };
    }
  ]);
  angular.module('bp').directive('bpTabbar', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        if (!attrs.role) {
          element.attr('role', 'tablist');
        }
      }
    };
  });
  angular.module('bp').directive('bpTab', [
    '$state',
    '$compile',
    '$timeout',
    'bpView',
    function ($state, $compile, $timeout, bpView) {
      return {
        priority: 100,
        restrict: 'E',
        scope: {
          uiSref: '@',
          bpTabIcon: '@',
          bpTabTitle: '@'
        },
        link: function (scope, element, attrs) {
          var state = $state.get(bpView.parseState(scope.uiSref).state);
          if (angular.isUndefined(attrs.bpTabTitle)) {
            if (angular.isObject(state.data) && state.data.title) {
              attrs.bpTabTitle = state.data.title;
            } else {
              if (state.name) {
                attrs.bpTabTitle = state.name.charAt(0).toUpperCase() + state.name.slice(1);
              }
            }
          }
          var $icon = $compile(angular.element('<span>').addClass('bp-icon {{bpTabIcon}}'))(scope);
          var $title = $compile(angular.element('<span>').attr('ng-bind', 'bpTabTitle'))(scope);
          element.append($icon, $title).attr('role', attrs.role || 'tab');
          scope.$on('$stateChangeSuccess', function () {
            if ($state.includes(scope.uiSref)) {
              element.addClass('bp-tab-active').attr('aria-selected', 'true');
              return;
            }
            element.removeClass('bp-tab-active').attr('aria-selected', 'false');
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpTableHeader', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        if (!attrs.role) {
          element.attr('role', 'heading');
        }
      }
    };
  });
  angular.module('bp').directive('bpTable', function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        if (!attrs.role) {
          var role = element.parents('bp-table').length ? 'group' : 'list';
          element.attr('role', role);
        }
      }
    };
  });
  angular.module('bp').directive('bpToolbar', [
    'bpApp',
    function (bpApp) {
      return {
        restrict: 'E',
        transclude: true,
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element) {
            if (bpApp.platform === 'android') {
              element.attr('aria-hidden', 'true');
              return;
            }
            element.attr('role', attrs.role || 'toolbar');
            transcludeFn(scope, function (clone) {
              var $actions;
              $actions = clone.filter('bp-action');
              $actions.each(function () {
                var $action = angular.element(this);
                var label = $action.attr('aria-label') || $action.text();
                $action.attr('aria-label', label).text('').removeClass('bp-button').addClass('bp-icon');
              });
              element.append($actions);
            });
          };
        }
      };
    }
  ]);
  angular.module('bp.util').provider('bpApp', function () {
    var config = { platform: 'ios' };
    this.setConfig = function (inConfig) {
      config = angular.extend(config, inConfig);
    };
    this.$get = function () {
      return config;
    };
  });
  angular.module('bp.util').service('bpView', [
    '$parse',
    'bpApp',
    function ($parse, bpApp) {
      this.getDirection = function (from, to) {
        if (from.url === '^') {
          return null;
        }
        if (angular.isObject(to.data) && to.data.up === from.name) {
          return 'normal';
        }
        if (angular.isObject(from.data) && from.data.up === to.name) {
          return 'reverse';
        }
        var fromSegs = this._getURLSegments(from);
        var toSegs = this._getURLSegments(to);
        var diff = toSegs.length - fromSegs.length;
        if (diff > 0 && fromSegs.join('') === toSegs.slice(0, -diff).join('')) {
          return 'normal';
        } else {
          if (diff < 0 && toSegs.join('') === fromSegs.slice(0, diff).join('')) {
            return 'reverse';
          }
        }
        return null;
      };
      this.getType = function (from, to, direction) {
        var typeFromState = function (state) {
          var data = state.data;
          var hasData = angular.isObject(data);
          if (hasData && angular.isString(data.transition)) {
            return data.transition;
          } else {
            if (hasData && data.modal) {
              return 'cover';
            }
          }
          return bpApp.platform === 'ios' ? 'slide' : 'scale';
        };
        if (direction === 'reverse') {
          return typeFromState(from);
        }
        return typeFromState(to);
      };
      this.parseState = function (ref, scope) {
        var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/);
        return {
          state: parsed[1],
          params: parsed[3] ? $parse(parsed[3])(scope) : null
        };
      };
      this._getURLSegments = function (state) {
        return (state.url || '').replace(/\/$/, '').split('/');
      };
      return this;
    }
  ]);
}.call(this));