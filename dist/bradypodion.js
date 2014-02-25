/*!
 * Bradypodion v0.5.0-beta.1
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Released under the MIT license.
 *
 * Date: 2014-02-25T12:08:54
 */
(function () {
  'use strict';
  angular.module('bp', [
    'ngAnimate',
    'ui.router'
  ]);
  angular.module('bp').directive('bpActionOverflow', [
    '$window',
    'bpConfig',
    'BpTap',
    function ($window, bpConfig, BpTap) {
      return {
        restrict: 'E',
        transclude: true,
        controller: [
          '$scope',
          '$animate',
          function ($scope, $animate) {
            $scope.open = function ($menu) {
              $menu.attr('aria-hidden', 'false');
              $animate.addClass($menu, 'bp-action-overflow-open');
            };
            $scope.close = function ($menu) {
              $menu.attr('aria-hidden', 'true');
              $animate.removeClass($menu, 'bp-action-overflow-open');
            };
          }
        ],
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element, attrs) {
            if (bpConfig.platform === 'ios') {
              element.attr('aria-hidden', 'true');
            } else {
              element.attr({
                role: 'button',
                'aria-has-popup': 'true'
              });
              new BpTap(scope, element, attrs);
              var open = false;
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
                element.on('tap', function () {
                  if (open) {
                    scope.close($menu);
                    open = false;
                  } else {
                    scope.open($menu);
                    open = true;
                  }
                });
                $actions.on('touchstart', function (e) {
                  e.stopPropagation();
                });
                $$window.on('touchstart', function () {
                  if (open) {
                    scope.close($menu);
                    open = false;
                    element.trigger('touchcancel');
                  }
                });
                scope.$on('$destroy', function () {
                  element.unbind('tap');
                  $actions.unbind('touchstart');
                  $$window.unbind('touchstart');
                });
              });
            }
          };
        }
      };
    }
  ]);
  angular.module('bp').directive('bpAction', function () {
    return {
      restrict: 'E',
      link: function (scope, element) {
        element.attr('role', 'button');
      }
    };
  });
  angular.module('bp').directive('bpApp', [
    '$compile',
    'bpConfig',
    'bpView',
    function ($compile, bpConfig, bpView) {
      return {
        restrict: 'AE',
        link: function (scope, element) {
          bpView.listen();
          element.addClass(bpConfig.platform).attr({ role: 'application' });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpCell', function () {
    return {
      restrict: 'E',
      transclude: true,
      compile: function (elem, attrs, transcludeFn) {
        return function (scope, element) {
          transcludeFn(scope, function (clone) {
            element.attr({ role: 'listitem' }).append(clone);
          });
        };
      }
    };
  });
  angular.module('bp').directive('bpDetailDisclosure', [
    'bpConfig',
    '$rootScope',
    function (bpConfig, $rootScope) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var $parent, uniqueId;
          if (bpConfig.platform === 'android') {
            element.attr('aria-hidden', 'true');
          } else {
            $parent = element.parent();
            if (!(uniqueId = $parent.attr('id'))) {
              if ($rootScope._uniqueId == null) {
                $rootScope._uniqueId = 0;
              }
              uniqueId = 'bp_' + $rootScope._uniqueId++;
              $parent.attr('id', uniqueId);
            }
            element.attr({
              'aria-describedby': uniqueId,
              'aria-label': 'More Info',
              role: 'button'
            });
          }
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
              ctrl.registerNavbar(attrs, clone, $state.current);
              element.remove();
            });
          };
        }
      };
    }
  ]);
  angular.module('bp').directive('bpNavbar', [
    'bpConfig',
    '$timeout',
    '$state',
    '$compile',
    function (bpConfig, $timeout, $state, $compile) {
      return {
        restrict: 'E',
        transclude: true,
        scope: { bpNavbarTitle: '@' },
        controller: [
          '$scope',
          function ($scope) {
            $scope.getTitleFromState = function (state) {
              if (angular.isObject(state.data) && angular.isString(state.data.title)) {
                return state.data.title;
              } else {
                return state.name.charAt(0).toUpperCase() + state.name.slice(1);
              }
            };
            $scope.convertActionToIcon = function ($action) {
              if (angular.isElement($action)) {
                $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
              }
            };
          }
        ],
        compile: function (elem, attrs, transcludeFn) {
          var ios = bpConfig.platform === 'android' ? false : true;
          return function (scope, element, attrs) {
            var state = $state.current;
            element.attr('role', 'navigation');
            transcludeFn(scope, function (clone) {
              var $arrow, $frstAction, $scndAction, $toolbar, $up;
              if (angular.isUndefined(attrs.bpNavbarTitle)) {
                attrs.bpNavbarTitle = scope.getTitleFromState(state);
              }
              var $title = $compile(angular.element('<bp-navbar-title>').attr({
                  role: 'heading',
                  'ng-bind': 'bpNavbarTitle'
                }))(scope);
              var $actions = clone.filter('bp-action');
              if (angular.isObject(state.data) && angular.isString(state.data.up) && !angular.isDefined(attrs.bpNavbarNoUp)) {
                var upState = $state.get(state.data.up);
                var upTitle = scope.getTitleFromState(upState);
                $arrow = angular.element('<bp-button-up>');
                $up = $compile(angular.element('<bp-action>').addClass('bp-action-up').attr('bp-sref', upState.name).text(upTitle))(scope);
              }
              if (ios) {
                if ($actions.length > 2) {
                  if (angular.isElement($up)) {
                    $frstAction = $up.addClass('bp-button');
                  }
                  $actions.each(function () {
                    scope.convertActionToIcon(angular.element(this));
                  });
                  $toolbar = angular.element('<bp-toolbar>').append($actions);
                } else {
                  if (angular.isElement($up)) {
                    $actions = $up.add($actions);
                  }
                  $frstAction = $actions.eq(0);
                  $scndAction = $actions.eq(1);
                  $actions.each(function () {
                    var $action = angular.element(this);
                    if ($action.hasClass('bp-icon')) {
                      scope.convertActionToIcon($action);
                    } else {
                      $action.addClass('bp-button');
                    }
                  });
                }
                element.append($frstAction, $title, $scndAction, $arrow).after($toolbar);
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
                    if (diff !== 0 && $frstAction.length) {
                      angular.element('<div>').css({
                        '-webkit-box-flex': '10',
                        'max-width': Math.abs(diff)
                      })[diff > 0 ? 'insertBefore' : 'insertAfter']($title);
                    }
                  }, 0);
                }
              } else {
                var $icon = angular.element('<bp-navbar-icon>');
                $frstAction = $actions.eq(0);
                $scndAction = $actions.eq(1);
                scope.convertActionToIcon($frstAction);
                scope.convertActionToIcon($scndAction);
                scope.convertActionToIcon($up);
                if ($actions.length > 2) {
                  $toolbar = $compile(angular.element('<bp-action-overflow>').append($actions.not($frstAction).not($scndAction)))(scope);
                }
                if (angular.isElement($up)) {
                  $up.append('<div>', $icon);
                  element.append($up, $title, $frstAction, $scndAction, $toolbar);
                } else {
                  element.append($icon, $title, $frstAction, $scndAction, $toolbar);
                }
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
    'bpConfig',
    function ($state, $compile, $animate, bpView, bpConfig) {
      return {
        controller: [
          '$scope',
          function ($scope) {
            $scope.bpNavbarConfig = {};
            this.registerNavbar = function (attrs, $actions, state) {
              var attrsHash = {};
              if (angular.isObject(attrs) && angular.isObject(attrs.$attr)) {
                for (var attr in attrs.$attr) {
                  attrsHash[attrs.$attr[attr]] = attrs[attr];
                }
              }
              $scope.bpNavbarConfig[state.name] = {
                $actions: $actions,
                attrs: attrsHash,
                noNavbar: angular.isDefined(attrs.bpNavbarNoNavbar) ? true : false
              };
            };
          }
        ],
        link: function (scope, element) {
          var $wrapper = angular.element('<bp-navbar-wrapper>');
          var $oldNavbar;
          element.prepend($wrapper);
          scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            var $navbar = angular.element();
            var navbarConfig = scope.bpNavbarConfig[toState.name] || {};
            var direction = bpView.getDirection(fromState, toState);
            if (!navbarConfig.noNavbar) {
              $navbar = angular.element('<bp-navbar>').append(navbarConfig.$actions).attr(navbarConfig.attrs || {});
            }
            $compile($navbar)(scope);
            if (bpConfig.platform === 'ios' && angular.isElement($oldNavbar)) {
              var animation = 'bp-navbar-' + direction;
              $animate.enter($navbar.addClass(animation), $wrapper);
              $animate.leave($oldNavbar.addClass(animation), function () {
                $oldNavbar = $navbar.removeClass(animation);
              });
            } else {
              $wrapper.append($navbar);
              if (angular.isElement($oldNavbar)) {
                $oldNavbar.remove();
              }
              $oldNavbar = $navbar;
            }
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
    'BpTap',
    'bpConfig',
    function ($compile, $timeout, $window, BpTap, bpConfig) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var ios = bpConfig.platform === 'ios';
          var childScope = scope.$new(true);
          var $bgLeft, $bgRight, $cancel;
          if (ios) {
            $bgLeft = angular.element('<bp-search-bg-left>');
            $bgRight = angular.element('<bp-search-bg-right>');
            $cancel = $compile(angular.element('<bp-action>').addClass('bp-button').text('Cancel'))(childScope);
          }
          var $placeholder = $compile(angular.element('<bp-search-placeholder>').append(angular.element('<bp-action>').addClass('bp-icon bp-icon-search')).append(angular.element('<span>').attr('ng-bind', 'placeholder')))(childScope);
          var $tapLayer = angular.element('<bp-search-tap>');
          var $search = element.find('input').attr({
              required: 'required',
              type: 'search'
            });
          childScope.placeholder = $search.attr('placeholder');
          if (childScope.placeholder == null) {
            childScope.placeholder = 'Search';
          }
          if (ios) {
            new BpTap(childScope, $cancel, {});
          }
          new BpTap(childScope, $tapLayer, {});
          element.attr('role', 'search').prepend($bgLeft, $bgRight).append($placeholder, $cancel, $tapLayer);
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
            }, 50);
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
            if (extra == null) {
              extra = {};
            }
            if (!ios) {
              element.removeClass('focus');
            } else if (!$search.val() && !extra.programatic) {
              $cancel.trigger('tap');
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
            $cancel.bind('tap', childScope.onCancel);
          }
          $search.bind('blur', childScope.onBlur);
          $tapLayer.bind('tap', childScope.onFocus).bind('click touchstart touchmove touchend', childScope.stopPropagation);
          scope.$on('$destroy', function () {
            childScope.$destroy();
            if (ios) {
              angular.element($window).unbind('resize orientationchange');
              $cancel.unbind('tap');
            }
            $search.unbind('blur');
            $tapLayer.unbind('tap click touchstart touchmove touchend');
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpSref', [
    '$state',
    '$parse',
    'BpTap',
    function ($state, $parse, BpTap) {
      return function (scope, element, attrs) {
        new BpTap(scope, element, attrs);
        element.bind('tap', function () {
          $state.transitionTo(attrs.bpSref);
          return false;
        });
        scope.$on('$destroy', function () {
          element.unbind('tap');
        });
      };
    }
  ]);
  angular.module('bp').directive('bpTabbar', function () {
    return {
      restrict: 'E',
      link: function (scope, element) {
        element.attr({ role: 'tablist' });
      }
    };
  });
  angular.module('bp').directive('bpTab', [
    '$state',
    '$compile',
    '$timeout',
    function ($state, $compile, $timeout) {
      return {
        restrict: 'E',
        scope: {
          bpSref: '@',
          bpTabIcon: '@',
          bpTabTitle: '@'
        },
        link: function (scope, element, attrs) {
          element.attr({ role: 'tab' });
          var state = $state.get(scope.bpSref);
          if (angular.isUndefined(attrs.bpTabTitle)) {
            if (angular.isObject(state.data) && state.data.title) {
              attrs.bpTabTitle = state.data.title;
            } else if (state.name) {
              attrs.bpTabTitle = state.name.charAt(0).toUpperCase() + state.name.slice(1);
            }
          }
          var $icon = $compile(angular.element('<span>').addClass('bp-icon {{bpTabIcon}}'))(scope);
          var $title = $compile(angular.element('<span>').attr('ng-bind', 'bpTabTitle'))(scope);
          element.append($icon, $title);
          scope.$on('$stateChangeSuccess', function () {
            if ($state.includes(scope.bpSref)) {
              element.addClass('bp-tab-active').attr('aria-selected', 'true');
            } else {
              element.removeClass('bp-tab-active').attr('aria-selected', 'false');
            }
          });
          element.bind('touchstart', function () {
            $timeout(function () {
              element.trigger('touchend');
            }, 500);
          });
          scope.$on('$destroy', function () {
            element.unbind('touchstart');
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpTableHeader', function () {
    return {
      restrict: 'E',
      link: function (scope, element) {
        element.attr({ role: 'heading' });
      }
    };
  });
  angular.module('bp').directive('bpTable', function () {
    return {
      restrict: 'E',
      link: function (scope, element) {
        var role;
        role = element.parents('bp-table').length ? 'group' : 'list';
        element.attr({ role: role });
      }
    };
  });
  angular.module('bp').directive('bpTap', [
    '$parse',
    'BpTap',
    function ($parse, BpTap) {
      return function (scope, element, attrs) {
        new BpTap(scope, element, attrs);
        element.bind('tap', function (e, touch) {
          scope.$apply($parse(attrs.bpTap), {
            $event: e,
            touch: touch
          });
          return false;
        });
        scope.$on('$destroy', function () {
          element.unbind('tap');
        });
      };
    }
  ]);
  angular.module('bp').directive('bpToolbar', [
    'bpConfig',
    function (bpConfig) {
      return {
        restrict: 'E',
        transclude: true,
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element) {
            if (bpConfig.platform === 'android') {
              element.attr('aria-hidden', 'true');
            } else {
              element.attr({ role: 'toolbar' });
              transcludeFn(scope, function (clone) {
                var $actions;
                $actions = clone.filter('bp-action');
                $actions.each(function () {
                  var $action = angular.element(this);
                  $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
                });
                element.append($actions);
              });
            }
          };
        }
      };
    }
  ]);
  angular.module('bp').provider('bpConfig', function () {
    var config = { platform: 'ios' };
    function BpConfig() {
      config.setConfig = this.setConfig;
    }
    BpConfig.prototype.$get = function () {
      return config;
    };
    BpConfig.prototype.setConfig = function (inConfig) {
      config = angular.extend(config, inConfig);
    };
    return BpConfig;
  }());
  angular.module('bp').factory('BpTap', [
    'bpConfig',
    function (bpConfig) {
      function BpTap(scope, element, attrs, customOptions) {
        this.element = element;
        this.touch = {};
        this.onTouchend = angular.bind(this, this.onTouchend);
        this.onTouchmove = angular.bind(this, this.onTouchmove);
        this.onTouchstart = angular.bind(this, this.onTouchstart);
        element.bind('touchstart', this.onTouchstart);
        element.bind('touchmove', this.onTouchmove);
        element.bind('touchend touchcancel', this.onTouchend);
        this._setOptions(attrs, customOptions);
        if (!this.options.allowClick && 'ontouchstart' in window) {
          this.element.bind('click', this.onClick);
        }
        scope.$on('$destroy', function () {
          element.unbind('touchstart touchmove touchend touchcancel click');
        });
      }
      BpTap.prototype.onClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isFunction(e.stopImmediatePropagation)) {
          e.stopImmediatePropagation();
        }
      };
      BpTap.prototype.onTouchstart = function (e) {
        var $t;
        this.touch.x = this._getCoordinate(e, true);
        this.touch.y = this._getCoordinate(e, false);
        this.touch.ongoing = true;
        $t = angular.element(e.target);
        if (($t.attr('bp-tap') != null || $t.attr('bp-sref') != null) && this.element.get(0) !== e.target) {
          this.touch.nestedTap = true;
        } else {
          this.element.addClass(this.options.activeClass);
        }
      };
      BpTap.prototype.onTouchmove = function (e) {
        var x, y;
        x = this._getCoordinate(e, true);
        y = this._getCoordinate(e, false);
        if (this.options.boundMargin != null && (Math.abs(this.touch.y - y) < this.options.boundMargin && Math.abs(this.touch.x - x) < this.options.boundMargin)) {
          if (!this.touch.nestedTap) {
            this.element.addClass(this.options.activeClass);
          }
          this.touch.ongoing = true;
          if (this.options.noScroll) {
            e.preventDefault();
          }
        } else {
          this.touch.ongoing = false;
          this.element.removeClass(this.options.activeClass);
        }
      };
      BpTap.prototype.onTouchend = function (e) {
        if (this.touch.ongoing && !this.touch.nestedTap && e.type === 'touchend') {
          this.element.trigger('tap', this.touch);
        }
        this.touch = {};
        this.element.removeClass(this.options.activeClass);
      };
      BpTap.prototype._setOptions = function (attrs, customOptions) {
        if (attrs == null) {
          attrs = {};
        }
        if (customOptions == null) {
          customOptions = {};
        }
        var options = angular.extend({
            activeClass: 'bp-active',
            allowClick: false,
            boundMargin: 50,
            noScroll: false
          }, bpConfig.tap || {});
        if (this.element.is('bp-action') && this.element.parent('bp-navbar') || this.element.is('bp-detail-disclosure')) {
          this.element.attr('bp-no-scroll', '');
          options.noScroll = true;
        }
        if (this.element.parents('[bp-iscroll]').length) {
          this.element.attr('bp-bound-margin', '5');
          options.boundMargin = 5;
        }
        angular.extend(options, customOptions);
        for (var key in options) {
          var attr = attrs['bp' + key.charAt(0).toUpperCase() + key.slice(1)];
          if (attr != null) {
            options[key] = attr === '' ? true : attr;
          }
        }
        this.options = options;
      };
      BpTap.prototype._getCoordinate = function (e, isX) {
        var axis;
        axis = isX ? 'pageX' : 'pageY';
        if (e.originalEvent != null) {
          e = e.originalEvent;
        }
        if (e[axis] != null) {
          return e[axis];
        } else if (angular.isObject(e.changedTouches) && angular.isObject(e.changedTouches[0])) {
          return e.changedTouches[0][axis];
        } else {
          return 0;
        }
      };
      return BpTap;
    }
  ]);
  angular.module('bp').service('bpView', [
    '$rootScope',
    function ($rootScope) {
      function BpView() {
        this.onViewContentLoaded = angular.bind(this, this.onViewContentLoaded);
        this.onStateChangeStart = angular.bind(this, this.onStateChangeStart);
      }
      BpView.prototype.listen = function () {
        $rootScope.$on('$stateChangeStart', this.onStateChangeStart);
        $rootScope.$on('$viewContentLoaded', this.onViewContentLoaded);
      };
      BpView.prototype.onStateChangeStart = function (event, toState, toParams, fromState) {
        var direction = toParams.direction || this.getDirection(fromState, toState);
        var type = toParams.transition || this.getType(fromState, toState, direction);
        this.setTransition(type, direction);
      };
      BpView.prototype.onViewContentLoaded = function () {
        var $views = angular.element('[ui-view], ui-view');
        if (this.transition != null) {
          $views.removeClass(this.lastTransition).addClass(this.transition);
          this.lastTransition = this.transition;
        } else {
          $views.removeClass(this.lastTransition);
        }
      };
      BpView.prototype.setTransition = function (type, direction) {
        if (type != null && direction != null) {
          this.transition = type + '-' + direction;
        } else {
          this.transition = null;
        }
      };
      BpView.prototype.getDirection = function (from, to) {
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
        var fromLen = fromSegs.length;
        var toLen = toSegs.length;
        var diff = toLen - fromLen;
        if (diff > 0 && angular.equals(fromSegs, toSegs.slice(0, toLen - diff))) {
          return 'normal';
        } else if (diff < 0 && angular.equals(toSegs, fromSegs.slice(0, fromLen + diff))) {
          return 'reverse';
        }
        return null;
      };
      BpView.prototype.getType = function (from, to, direction) {
        if (direction === 'reverse') {
          if (angular.isObject(from.data)) {
            return from.data.transition || null;
          }
        } else {
          if (angular.isObject(to.data)) {
            return to.data.transition || null;
          }
        }
        return null;
      };
      BpView.prototype._getURLSegments = function (state) {
        return (state.url || '').replace(/\/$/, '').split('/');
      };
      return new BpView();
    }
  ]);
}.call(this));