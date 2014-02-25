/*!
 * Bradypodion v0.5.0-alpha.3
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Currently in private beta.
 *
 * Date: 2014-02-17T14:07:21
 */

(function() {
  'use strict';
  var deps,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('bp', ['ngAnimate', 'ui.router']);

  deps = function(deps, fn) {
    deps.push(fn);
    return deps;
  };

  angular.module('bp').directive('bpAction', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.attr('role', 'button');
      }
    };
  });

  angular.module('bp').directive('bpApp', deps(['$compile', 'bpConfig', 'bpView'], function($compile, bpConfig, bpView) {
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        bpView.listen();
        return element.addClass(bpConfig.platform).attr({
          role: 'application'
        });
      }
    };
  }));

  angular.module('bp').directive('bpCell', function() {
    return {
      restrict: 'E',
      transclude: true,
      compile: function(elem, attrs, transcludeFn) {
        return function(scope, element, attrs) {
          return transcludeFn(scope, function(clone) {
            return element.attr({
              role: 'listitem'
            }).append(clone);
          });
        };
      }
    };
  });

  angular.module('bp').directive('bpDetailDisclosure', deps(['bpConfig', '$rootScope'], function(bpConfig, $rootScope) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var $parent, uniqueId;
        if (bpConfig.platform === 'android') {
          return element.attr('aria-hidden', 'true');
        } else {
          $parent = element.parent();
          if (!(uniqueId = $parent.attr('id'))) {
            if ($rootScope._uniqueId == null) {
              $rootScope._uniqueId = 0;
            }
            uniqueId = 'bp_' + $rootScope._uniqueId++;
            $parent.attr('id', uniqueId);
          }
          return element.attr({
            'aria-describedby': uniqueId,
            'aria-label': 'More Info',
            role: 'button'
          });
        }
      }
    };
  }));

  angular.module('bp').directive('bpIscroll', deps(['bpConfig', '$timeout'], function(bpConfig, $timeout) {
    return {
      transclude: true,
      template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
      controller: function($scope) {
        var iscroll, iscrollsticky;
        iscroll = null;
        iscrollsticky = null;
        $scope.getIScroll = function() {
          return iscroll;
        };
        $scope.getIScrollSticky = function() {
          return iscrollsticky;
        };
        return $scope.setIScroll = function(inIscroll, inSticky) {
          iscroll = inIscroll;
          return iscrollsticky = inSticky;
        };
      },
      link: function(scope, element, attrs) {
        var options;
        options = angular.extend({
          probeType: 3,
          scrollbars: true
        }, bpConfig.iscroll);
        $timeout(function() {
          var isc, iscs, selector;
          isc = new IScroll(element.get(0), options);
          if ((attrs.bpIscrollSticky != null) && bpConfig.platform !== 'android') {
            selector = attrs.bpIscrollSticky || 'bp-table-header';
            iscs = new IScrollSticky(isc, selector);
          }
          return scope.setIScroll(isc, iscs);
        }, 0);
        return element.on('$destroy', function() {
          return scope.getIScroll().destroy();
        });
      }
    };
  }));

  angular.module('bp').directive('bpNavbar', deps(['bpConfig', '$timeout', '$state', '$compile'], function(bpConfig, $timeout, $state, $compile) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        bpNavbarTitle: '@'
      },
      controller: function($scope) {
        return $scope.getTitleFromState = function(state) {
          var _ref;
          return ((_ref = state.data) != null ? _ref.title : void 0) || state.name.charAt(0).toUpperCase() + state.name.slice(1);
        };
      },
      compile: function(elem, attrs, transcludeFn) {
        var ios;
        ios = bpConfig.platform === 'android' ? false : true;
        return function(scope, element, attrs) {
          var state;
          state = $state.current;
          element.attr({
            role: 'navigation'
          });
          return transcludeFn(scope, function(clone) {
            var $actions, $arrow, $frstAction, $icon, $scndAction, $title, $up, handleAction, upState, upTitle, _ref;
            if (attrs.bpNavbarTitle == null) {
              attrs.bpNavbarTitle = scope.getTitleFromState(state);
            }
            $title = $compile("<bp-navbar-title role='heading'>{{ bpNavbarTitle }}</bp-navbar-title>")(scope);
            $actions = clone.filter('bp-action');
            if ((((_ref = state.data) != null ? _ref.up : void 0) != null) && (attrs.bpNavbarNoUp == null)) {
              upState = $state.get(state.data.up);
              upTitle = scope.getTitleFromState(upState);
              $up = $compile("<bp-action class='bp-action-up' bp-sref='" + upState.name + "'>" + upTitle + "</bp-action>")(scope);
              if (ios) {
                $actions = $up.add($actions);
              }
              $arrow = angular.element('<bp-button-up>');
            }
            if ($actions.length <= 2) {
              $frstAction = $actions.eq(0);
              $scndAction = $actions.eq(1);
              if (ios) {
                $actions.addClass('bp-button');
                element.append($frstAction, $title, $scndAction, $arrow);
                if (!scope.navbarTitle) {
                  return $timeout(function() {
                    var $spacer, difference;
                    difference = $scndAction.outerWidth() - $frstAction.outerWidth();
                    if (difference !== 0 && $frstAction.length) {
                      $spacer = angular.element("<div style=' -webkit-box-flex:10; max-width:" + (Math.abs(difference)) + "px '>");
                      return $spacer[difference > 0 ? 'insertBefore' : 'insertAfter']($title);
                    }
                  }, 0);
                }
              } else {
                handleAction = function($action) {
                  return $action.attr('aria-label', $action.text()).text('').addClass('bp-icon');
                };
                $actions.each(function() {
                  var $action;
                  $action = angular.element(this);
                  return handleAction($action);
                });
                if ($up) {
                  handleAction($up);
                }
                $icon = angular.element('<bp-navbar-icon>');
                if ($up != null) {
                  $up.append('<div>').append($icon);
                  return element.append($up, $title, $frstAction, $scndAction);
                } else {
                  return element.append($icon, $title, $frstAction, $scndAction);
                }
              }
            }
          });
        };
      }
    };
  }));

  angular.module('bp').directive('bpScroll', deps([], function() {
    return function(scope, element, attrs) {
      element.bind('touchstart', function() {});
      return scope.$on('$destroy', function() {
        return element.unbind('touchstart');
      });
    };
  }));

  angular.module('bp').directive('bpSearch', deps(['$compile', '$timeout', '$window', 'BpTap', 'bpConfig'], function($compile, $timeout, $window, BpTap, bpConfig) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var $bgLeft, $bgRight, $cancel, $placeholder, $search, $tapLayer, cancelWidth, childScope, ios;
        ios = bpConfig.platform === 'ios';
        childScope = scope.$new(true);
        if (ios) {
          $bgLeft = angular.element('<bp-search-bg-left>');
          $bgRight = angular.element('<bp-search-bg-right>');
          $cancel = $compile('<bp-action class="bp-button">Cancel</bp-action>')(childScope);
        }
        $placeholder = $compile('<bp-search-placeholder> <bp-action class="bp-icon bp-icon-search"></bp-action> <span>{{ placeholder }}</span> </bp-search-placeholder>')(childScope);
        $tapLayer = angular.element('<bp-search-tap>');
        $search = element.find('input').attr({
          'required': 'required',
          'type': 'search'
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
          cancelWidth = null;
          $timeout(function() {
            var iconWidth, inputWidth, width;
            width = element.outerWidth();
            cancelWidth = $cancel.outerWidth();
            iconWidth = $placeholder.find('.bp-icon').outerWidth();
            inputWidth = width - cancelWidth - 6;
            $bgLeft.css('width', inputWidth);
            $bgRight.css('width', cancelWidth);
            return $search.css({
              'width': inputWidth,
              'padding-left': 1.5 * iconWidth
            });
          }, 50);
          childScope.onResize = function() {
            var inputWidth;
            inputWidth = element.outerWidth() - cancelWidth;
            return $bgLeft.css('width', inputWidth);
          };
          childScope.onCancel = function() {
            element.removeClass('focus');
            return $search.val('').trigger('input').trigger('blur', {
              programatic: true
            });
          };
        }
        childScope.onBlur = function(e, extra) {
          if (extra == null) {
            extra = {};
          }
          if (!ios) {
            return element.removeClass('focus');
          } else if (!$search.val() && !extra.programatic) {
            return $cancel.trigger('tap');
          }
        };
        childScope.onFocus = function() {
          $search.focus();
          return $timeout(function() {
            return element.addClass('focus');
          }, 0);
        };
        childScope.stopPropagation = function(e) {
          e.stopPropagation();
          return e.stopImmediatePropagation();
        };
        if (ios) {
          angular.element($window).bind('resize orientationchange', childScope.onResize);
          $cancel.bind('tap', childScope.onCancel);
        }
        $search.bind('blur', childScope.onBlur);
        $tapLayer.bind('tap', childScope.onFocus);
        $tapLayer.bind('click touchstart touchmove touchend', childScope.stopPropagation);
        return scope.$on('$destroy', function() {
          childScope.$destroy();
          if (ios) {
            angular.element($window).unbind('resize orientationchange');
            $cancel.unbind('tap');
          }
          $search.unbind('blur');
          return $tapLayer.unbind('tap click touchstart touchmove touchend');
        });
      }
    };
  }));

  angular.module('bp').directive('bpSref', deps(['$state', '$parse', 'BpTap'], function($state, $parse, BpTap) {
    return function(scope, element, attrs) {
      new BpTap(scope, element, attrs);
      element.bind('tap', function() {
        $state.transitionTo(attrs.bpSref);
        return false;
      });
      return scope.$on('$destroy', function() {
        return element.unbind('tap');
      });
    };
  }));

  angular.module('bp').directive('bpTabbar', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.attr({
          role: 'tablist'
        });
      }
    };
  });

  angular.module('bp').directive('bpTab', deps(['$state', '$compile', '$timeout'], function($state, $compile, $timeout) {
    return {
      restrict: 'E',
      scope: {
        bpSref: '@',
        bpTabIcon: '@',
        bpTabTitle: '@'
      },
      link: function(scope, element, attrs) {
        var $icon, $title, state, _ref, _ref1, _ref2;
        element.attr({
          role: 'tab'
        });
        state = $state.get(scope.bpSref);
        if (attrs.bpTabTitle == null) {
          attrs.bpTabTitle = ((_ref = state.data) != null ? _ref.title : void 0) || ((_ref1 = state.name) != null ? _ref1.charAt(0).toUpperCase() : void 0) + ((_ref2 = state.name) != null ? _ref2.slice(1) : void 0);
        }
        $icon = $compile("<span class='bp-icon {{bpTabIcon}}'></span>")(scope);
        $title = $compile("<span>{{ bpTabTitle }}</span>")(scope);
        element.append($icon, $title);
        scope.$on('$stateChangeSuccess', function() {
          if ($state.includes(scope.bpSref)) {
            return element.addClass('bp-tab-active').attr('aria-selected', 'true');
          } else {
            return element.removeClass('bp-tab-active').attr('aria-selected', 'false');
          }
        });
        element.bind('touchstart', function() {
          return $timeout(function() {
            return element.trigger('touchend');
          }, 500);
        });
        return scope.$on('$destroy', function() {
          return element.unbind('touchstart');
        });
      }
    };
  }));

  angular.module('bp').directive('bpTableHeader', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.attr({
          role: 'heading'
        });
      }
    };
  });

  angular.module('bp').directive('bpTable', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var role;
        role = element.parents('bp-table').length ? 'group' : 'list';
        return element.attr({
          role: role
        });
      }
    };
  });

  angular.module('bp').directive('bpTap', deps(['$parse', 'BpTap'], function($parse, BpTap) {
    return function(scope, element, attrs) {
      new BpTap(scope, element, attrs);
      element.bind('tap', function(e, touch) {
        scope.$apply($parse(attrs.bpTap), {
          $event: e,
          touch: touch
        });
        return false;
      });
      return scope.$on('$destroy', function() {
        return element.unbind('tap');
      });
    };
  }));

  angular.module('bp').provider('bpConfig', (function() {
    var BpConfig;
    return BpConfig = (function() {
      var config;

      config = {
        platform: 'ios'
      };

      function BpConfig() {
        config.setConfig = this.setConfig;
      }

      BpConfig.prototype.$get = function() {
        return config;
      };

      BpConfig.prototype.setConfig = function(inConfig) {
        return config = angular.extend(config, inConfig);
      };

      return BpConfig;

    })();
  })());

  angular.module('bp').factory('BpTap', deps(['bpConfig'], function(bpConfig) {
    var BpTap;
    return BpTap = (function() {
      function BpTap(scope, element, attrs, customOptions) {
        this.element = element;
        this.onTouchend = __bind(this.onTouchend, this);
        this.onTouchmove = __bind(this.onTouchmove, this);
        this.onTouchstart = __bind(this.onTouchstart, this);
        this.touch = {};
        this._setOptions(attrs, customOptions);
        if ((!this.options.allowClick) && 'ontouchstart' in window) {
          this.element.bind('click', this.onClick);
        }
        this.element.bind('touchstart', this.onTouchstart);
        this.element.bind('touchmove', this.onTouchmove);
        this.element.bind('touchend touchcancel', this.onTouchend);
        scope.$on('$destroy', (function(_this) {
          return function() {
            return _this.element.unbind('touchstart touchmove touchend touchcancel click');
          };
        })(this));
      }

      BpTap.prototype.onClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }
      };

      BpTap.prototype.onTouchstart = function(e) {
        var $t;
        this.touch.x = this._getCoordinate(e, true);
        this.touch.y = this._getCoordinate(e, false);
        this.touch.ongoing = true;
        $t = $(e.target);
        if ((($t.attr('bp-tap') != null) || ($t.attr('bp-sref') != null)) && this.element.get(0) !== e.target) {
          this.touch.nestedTap = true;
        } else {
          this.element.addClass(this.options.activeClass);
        }
      };

      BpTap.prototype.onTouchmove = function(e) {
        var x, y;
        x = this._getCoordinate(e, true);
        y = this._getCoordinate(e, false);
        if ((this.options.boundMargin != null) && (Math.abs(this.touch.y - y) < this.options.boundMargin && Math.abs(this.touch.x - x) < this.options.boundMargin)) {
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

      BpTap.prototype.onTouchend = function(e) {
        if (this.touch.ongoing && !this.touch.nestedTap && e.type === 'touchend') {
          this.element.trigger('tap', this.touch);
        }
        this.touch = {};
        this.element.removeClass(this.options.activeClass);
      };

      BpTap.prototype._setOptions = function(attrs, customOptions) {
        var attr, key, options;
        if (attrs == null) {
          attrs = {};
        }
        if (customOptions == null) {
          customOptions = {};
        }
        options = {
          activeClass: 'bp-active',
          allowClick: false,
          boundMargin: 50,
          noScroll: false
        };
        options = angular.extend(options, bpConfig.tap || {});
        if ((this.element.is('bp-action') && this.element.parent('bp-navbar')) || this.element.is('bp-detail-disclosure')) {
          this.element.attr('bp-no-scroll', '');
          options.noScroll = true;
        }
        if (this.element.parents('[bp-iscroll]').length) {
          this.element.attr('bp-bound-margin', '5');
          options.boundMargin = 5;
        }
        angular.extend(options, customOptions);
        for (key in options) {
          attr = attrs["bp" + (key.charAt(0).toUpperCase()) + (key.slice(1))];
          if (attr != null) {
            options[key] = attr === '' ? true : attr;
          }
        }
        return this.options = options;
      };

      BpTap.prototype._getCoordinate = function(e, isX) {
        var axis, _ref;
        axis = isX ? 'pageX' : 'pageY';
        if (e.originalEvent != null) {
          e = e.originalEvent;
        }
        if (e[axis] != null) {
          return e[axis];
        } else if (((_ref = e.changedTouches) != null ? _ref[0] : void 0) != null) {
          return e.changedTouches[0][axis];
        } else {
          return 0;
        }
      };

      return BpTap;

    })();
  }));

  angular.module('bp').service('bpView', deps(['$rootScope', '$state'], function($rootScope, $state) {
    var BpView;
    BpView = (function() {
      function BpView() {
        this.onViewContentLoaded = __bind(this.onViewContentLoaded, this);
        this.onStateChangeStart = __bind(this.onStateChangeStart, this);
        this.transition = null;
        this.lastTransition = null;
      }

      BpView.prototype.listen = function() {
        $rootScope.$on('$stateChangeStart', this.onStateChangeStart);
        return $rootScope.$on('$viewContentLoaded', this.onViewContentLoaded);
      };

      BpView.prototype.onStateChangeStart = function(event, toState, toParams, fromState, fromParams) {
        var direction, type;
        direction = toParams.direction || this.getDirection(fromState, toState);
        type = toParams.transition || this.getType(fromState, toState, direction);
        return this.setTransition(type, direction);
      };

      BpView.prototype.onViewContentLoaded = function() {
        var $views;
        $views = angular.element('[ui-view], ui-view');
        if (this.transition != null) {
          $views.removeClass(this.lastTransition).addClass(this.transition);
          return this.lastTransition = this.transition;
        } else {
          return $views.removeClass(this.lastTransition);
        }
      };

      BpView.prototype.setTransition = function(type, direction) {
        return this.transition = (type != null) && (direction != null) ? "" + type + "-" + direction : null;
      };

      BpView.prototype.getDirection = function(from, to) {
        var direction, fromSegments, index, segment, toSegments, _i, _len;
        direction = 'normal';
        if (from.url === '^') {
          return null;
        }
        fromSegments = this._getURLSegments(from);
        toSegments = this._getURLSegments(to);
        if (toSegments.length < fromSegments.length) {
          direction = 'reverse';
          for (index = _i = 0, _len = toSegments.length; _i < _len; index = ++_i) {
            segment = toSegments[index];
            if (segment !== fromSegments[index]) {
              direction = 'normal';
              break;
            }
          }
          direction;
        } else if (toSegments.length === fromSegments.length) {
          direction = null;
        }
        return direction;
      };

      BpView.prototype.getType = function(from, to, direction) {
        var _ref, _ref1;
        if (direction === 'reverse') {
          return ((_ref = from.data) != null ? _ref.transition : void 0) || null;
        } else {
          return ((_ref1 = to.data) != null ? _ref1.transition : void 0) || null;
        }
      };

      BpView.prototype._getURLSegments = function(state) {
        var url;
        url = state.url || '';
        url = url.replace(/\/$/, '');
        return url.split('/');
      };

      return BpView;

    })();
    return new BpView;
  }));

}).call(this);
