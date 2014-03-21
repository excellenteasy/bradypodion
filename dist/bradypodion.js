/*!
 * Bradypodion v0.5.1-beta.1
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Released under the MIT license.
 *
 * Date: 2014-03-21T21:28:51
 */
(function () {
  'use strict';
  angular.module('bp.util', []);
  angular.module('bp', [
    'bp.util',
    'ngAnimate',
    'ui.router'
  ]);
  angular.module('bp').directive('bpActionOverflow', [
    '$window',
    'bpApp',
    'bpTap',
    function ($window, bpApp, bpTap) {
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
        compile: function (elem, attrs, transcludeFn) {
          return function (scope, element, attrs, ctrl) {
            if (bpApp.platform === 'ios') {
              element.attr('aria-hidden', 'true');
            } else {
              element.attr({
                role: 'button',
                'aria-has-popup': 'true'
              });
              var tap = bpTap(element, attrs);
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
                    ctrl.close($menu);
                    open = false;
                  } else {
                    ctrl.open($menu);
                    open = true;
                  }
                });
                $actions.on('touchstart', function (e) {
                  e.stopPropagation();
                });
                $$window.on('touchstart', function () {
                  if (open) {
                    ctrl.close($menu);
                    open = false;
                    element.trigger('touchcancel');
                  }
                });
                scope.$on('$destroy', function () {
                  tap.disable();
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
              if (angular.isString(this.transition)) {
                $views.removeClass(this.lastTransition).addClass(this.transition);
                this.lastTransition = this.transition;
              } else {
                $views.removeClass(this.lastTransition);
              }
            };
            this.setTransition = function (type, direction) {
              if (angular.isString(type) && angular.isString(direction)) {
                this.transition = type + '-' + direction;
              } else {
                this.transition = null;
              }
            };
            this.onViewContentLoaded = angular.bind(this, this.onViewContentLoaded);
            this.onStateChangeStart = angular.bind(this, this.onStateChangeStart);
            return this;
          }
        ],
        link: function (scope, element, attrs, ctrl) {
          scope.$on('$stateChangeStart', ctrl.onStateChangeStart);
          scope.$on('$viewContentLoaded', ctrl.onViewContentLoaded);
          element.addClass(bpApp.platform).attr({ role: 'application' });
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
    'bpApp',
    '$rootScope',
    function (bpApp, $rootScope) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var $parent, uniqueId;
          if (bpApp.platform === 'android') {
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
    function (bpApp, bpView, $timeout, $state, $compile, $log) {
      return {
        restrict: 'E',
        transclude: true,
        controller: function () {
          this.getTitleFromState = function (state) {
            if (angular.isObject(state.data) && angular.isString(state.data.title)) {
              return state.data.title;
            } else {
              return state.name.charAt(0).toUpperCase() + state.name.slice(1);
            }
          };
          this.convertActionToIcon = function ($action) {
            if (angular.isElement($action)) {
              $action.attr('aria-label', $action.text()).text('').removeClass('bp-button').addClass('bp-icon');
            }
          };
        },
        compile: function (elem, attrs, transcludeFn) {
          var ios = bpApp.platform === 'android' ? false : true;
          return function (scope, element, attrs, ctrl) {
            var state = $state.current;
            element.attr('role', 'navigation');
            transcludeFn(scope, function (clone) {
              var $arrow, $frstAction, $scndAction, $toolbar, $up, title;
              if (angular.isUndefined(attrs.bpNavbarTitle)) {
                title = ctrl.getTitleFromState(state);
              } else {
                title = attrs.bpNavbarTitle;
              }
              var $title = $compile(angular.element('<bp-navbar-title>').attr('role', 'heading').text(title))(scope);
              var $actions = clone.filter('bp-action');
              var up;
              if (angular.isObject(state.data) && angular.isString(state.data.up)) {
                up = state.data.up;
              } else {
                if (state.url) {
                  var urlSegments = bpView._getURLSegments(state);
                  up = urlSegments[urlSegments.length - 2];
                }
              }
              if (up && up[0] == ':') {
                $log.error('cannot detect up state from parameter. Please set the up property on the data object in your state configuration.');
              }
              if (up && up[0] !== ':' && !angular.isDefined(attrs.bpNavbarNoUp)) {
                var ref = bpView.parseState(up);
                var upState = $state.get(ref.state);
                if (upState) {
                  var upTitle = ctrl.getTitleFromState(upState);
                  $arrow = angular.element('<bp-button-up>');
                  $up = $compile(angular.element('<bp-action>').addClass('bp-action-up').attr('bp-sref', up).text(upTitle))(scope);
                } else {
                  $log.error('up state detection failed. No up button compiled. Check your state configuration.');
                }
              }
              if (ios) {
                if ($actions.length > 2) {
                  if (angular.isElement($up)) {
                    $frstAction = $up.addClass('bp-button');
                  }
                  $actions.each(function () {
                    ctrl.convertActionToIcon(angular.element(this));
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
                      ctrl.convertActionToIcon($action);
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
                  }, 0, false);
                }
              } else {
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
    'bpTap',
    'bpApp',
    function ($compile, $timeout, $window, bpTap, bpApp) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var ios = bpApp.platform === 'ios';
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
            var cancelTap = bpTap($cancel);
          }
          var tap = bpTap($tapLayer);
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
            if (extra == null) {
              extra = {};
            }
            if (!ios) {
              element.removeClass('focus');
            } else {
              if (!$search.val() && !extra.programatic) {
                $cancel.trigger('tap');
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
            $cancel.bind('tap', childScope.onCancel);
          }
          $search.bind('blur', childScope.onBlur);
          $tapLayer.bind('tap', childScope.onFocus).bind('click touchstart touchmove touchend', childScope.stopPropagation);
          scope.$on('$destroy', function () {
            childScope.$destroy();
            if (ios) {
              angular.element($window).unbind('resize orientationchange');
              cancelTap.disable();
            }
            $search.unbind('blur');
            tap.disable();
          });
        }
      };
    }
  ]);
  angular.module('bp').directive('bpSref', [
    '$state',
    '$parse',
    'bpTap',
    'bpView',
    function ($state, $parse, bpTap, bpView) {
      return function (scope, element, attrs) {
        var tap = bpTap(element, attrs);
        element.bind('tap', function () {
          var ref = bpView.parseState(attrs.bpSref, scope);
          $state.go(ref.state, ref.params);
          return false;
        });
        scope.$on('$destroy', function () {
          tap.disable();
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
    'bpView',
    function ($state, $compile, $timeout, bpView) {
      return {
        restrict: 'E',
        scope: {
          bpSref: '@',
          bpTabIcon: '@',
          bpTabTitle: '@'
        },
        link: function (scope, element, attrs) {
          element.attr({ role: 'tab' });
          var state = $state.get(bpView.parseState(scope.bpSref).state);
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
    'bpTap',
    function ($parse, bpTap) {
      return function (scope, element, attrs) {
        var tap = bpTap(element, attrs);
        element.bind('tap', function (e, touch) {
          scope.$apply($parse(attrs.bpTap), {
            $event: e,
            touch: touch
          });
          return false;
        });
        scope.$on('$destroy', function () {
          tap.disable();
        });
      };
    }
  ]);
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
  angular.module('bp.util').provider('bpApp', function () {
    var config = { platform: 'ios' };
    this.setConfig = function (inConfig) {
      config = angular.extend(config, inConfig);
    };
    this.$get = function () {
      return config;
    };
  });
  angular.module('bp').provider('bpTap', function () {
    var globalConfig = {
        activeClass: 'bp-active',
        allowClick: false,
        boundMargin: 50,
        noScroll: false
      };
    this.setConfig = function (inConfig) {
      globalConfig = angular.extend(globalConfig, inConfig);
    };
    function bpTap(element, attrs) {
      var config = angular.copy(globalConfig);
      var touch = {};
      var _getCoordinate = function (e, isX) {
        var axis = isX ? 'pageX' : 'pageY';
        if (angular.isDefined(e.originalEvent)) {
          e = e.originalEvent;
        }
        if (angular.isDefined(e[axis])) {
          return e[axis];
        } else {
          if (angular.isObject(e.changedTouches) && angular.isObject(e.changedTouches[0])) {
            return e.changedTouches[0][axis];
          } else {
            return 0;
          }
        }
      };
      var onClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (angular.isFunction(e.stopImmediatePropagation)) {
          e.stopImmediatePropagation();
        }
      };
      var onTouchstart = function (e) {
        var $target = angular.element(e.target);
        touch.x = _getCoordinate(e, true);
        touch.y = _getCoordinate(e, false);
        touch.ongoing = true;
        if ((angular.isDefined($target.attr('bp-tap')) || angular.isDefined($target.attr('bp-sref'))) && element.get(0) !== e.target) {
          touch.nestedTap = true;
        } else {
          element.addClass(config.activeClass);
        }
      };
      var onTouchmove = function (e) {
        var x = _getCoordinate(e, true);
        var y = _getCoordinate(e, false);
        if (config.boundMargin != null && (Math.abs(touch.y - y) < config.boundMargin && Math.abs(touch.x - x) < config.boundMargin)) {
          if (!touch.nestedTap) {
            element.addClass(config.activeClass);
          }
          touch.ongoing = true;
          if (config.noScroll) {
            e.preventDefault();
          }
        } else {
          touch.ongoing = false;
          element.removeClass(config.activeClass);
        }
      };
      var onTouchend = function (e) {
        if (touch.ongoing && !touch.nestedTap && e.type === 'touchend') {
          element.trigger('tap', touch);
        }
        element.removeClass(config.activeClass);
        delete touch.x;
        delete touch.y;
        delete touch.ongoing;
        delete touch.nestedTap;
      };
      var disable = function () {
        element.unbind('tap touchstart touchmove touchend touchcancel click');
      };
      var _setConfig = function (attrs) {
        var attrConfig = {};
        if (element.is('bp-action') && element.parent('bp-navbar') || element.is('bp-detail-disclosure')) {
          element.attr('bp-no-scroll', '');
          attrConfig.noScroll = true;
        }
        if (element.parents('[bp-iscroll]').length) {
          element.attr('bp-bound-margin', '5');
          attrConfig.boundMargin = 5;
        }
        if (angular.isObject(attrs)) {
          for (var key in config) {
            var attr = attrs['bp' + key.charAt(0).toUpperCase() + key.slice(1)];
            if (angular.isDefined(attr)) {
              attrConfig[key] = attr === '' ? true : attr;
            }
          }
        }
        angular.extend(config, attrConfig);
      };
      element.bind('touchstart', onTouchstart);
      element.bind('touchmove', onTouchmove);
      element.bind('touchend touchcancel', onTouchend);
      _setConfig(attrs);
      if (!config.allowClick && 'ontouchstart' in window) {
        element.bind('click', onClick);
      }
      return {
        touch: touch,
        options: config,
        disable: disable,
        onClick: onClick,
        onTouchstart: onTouchstart,
        onTouchmove: onTouchmove,
        onTouchend: onTouchend,
        _getCoordinate: _getCoordinate,
        _setConfig: _setConfig
      };
    }
    this.$get = function () {
      return bpTap;
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
        var fromLen = fromSegs.length;
        var toLen = toSegs.length;
        var diff = toLen - fromLen;
        if (diff > 0 && angular.equals(fromSegs, toSegs.slice(0, toLen - diff))) {
          return 'normal';
        } else {
          if (diff < 0 && angular.equals(toSegs, fromSegs.slice(0, fromLen + diff))) {
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
            } else {
              return bpApp.platform === 'ios' ? 'slide' : 'scale';
            }
          }
        };
        if (direction === 'reverse') {
          return typeFromState(from);
        } else {
          return typeFromState(to);
        }
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