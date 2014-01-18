(function() {
  'use strict';
  var BpConfig, deps, inject, module, modules, namespaced;

  modules = ['animations', 'directives', 'factories', 'controllers', 'services'];

  modules = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = modules.length; _i < _len; _i++) {
      module = modules[_i];
      inject = [];
      if (module === 'controllers') {
        inject.push('bp.services');
      }
      if (module === 'animations') {
        inject.push('ngAnimate');
      }
      angular.module((namespaced = "bp." + module), inject);
      _results.push(namespaced);
    }
    return _results;
  })();

  angular.module('bp', modules);

  deps = function(deps, fn) {
    deps.push(fn);
    return deps;
  };

  angular.module('bp.controllers').controller('bpViewCtrl', deps(['bpViewService'], function(bpViewService) {}));

  angular.module('bp.directives').directive('body', deps(['bpConfig'], function(bpConfig) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var latestPlatform;
        scope.config = bpConfig;
        latestPlatform = scope.config.platform;
        return element.addClass(scope.config.platform).attr({
          role: 'application'
        });
      }
    };
  }));

  angular.module('bp.directives').directive('bpButton', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var attributes, label;
        attributes = {
          role: 'button'
        };
        if (element.hasClass('bp-button-back') && !attrs['aria-label']) {
          attributes['aria-label'] = (label = element.text()) ? "Back to " + label : "Back";
        }
        return element.attr(attributes);
      }
    };
  });

  angular.module('bp.directives').directive('bpCell', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: '',
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

  angular.module('bp.directives').directive('bpDetailDisclosure', deps(['bpConfig'], function(bpConfig) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var $parent, uniqueId;
        if (bpConfig.platform === 'android') {
          return element.attr('aria-hidden', 'true');
        } else {
          $parent = element.parent();
          if (!(uniqueId = $parent.attr('id'))) {
            uniqueId = _.uniqueId('bp_');
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

  angular.module('bp.directives').directive('bpIscroll', deps(['bpConfig', '$timeout'], function(bpConfig, $timeout) {
    return {
      transclude: true,
      template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
      link: function(scope, element, attrs) {
        var delay, instanciateIScroll, iscroll, options;
        iscroll = {};
        scope.getIScroll = function() {
          return iscroll;
        };
        delay = 0;
        options = angular.extend({
          delay: delay,
          stickyHeadersSelector: 'bp-table-header',
          scrollbarsEnabled: true
        }, bpConfig.iscroll || {});
        if (attrs.bpIscrollNoScrollbars != null) {
          options.scrollbarsEnabled = false;
        }
        if (attrs.bpIscrollSticky != null) {
          options.stickyHeadersEnabled = true;
          if (attrs.bpIscrollSticky !== '') {
            options.stickyHeadersSelector = attrs.bpIscrollSticky;
          }
        }
        instanciateIScroll = function() {
          iscroll = new IScroll(element[0], {
            probeType: 3,
            scrollbars: options.scrollbarsEnabled
          });
          if (options.stickyHeadersEnabled && bpConfig.platform !== 'android') {
            return new IScrollSticky(iscroll, options.stickyHeadersSelector);
          }
        };
        $timeout(instanciateIScroll, options.delay);
        scope.$on('bpRefreshIScrollInstances', function() {
          var _ref;
          return (_ref = scope.getIScroll()) != null ? typeof _ref.refresh === "function" ? _ref.refresh() : void 0 : void 0;
        });
        scope.$on('$destroy', function() {
          return iscroll.destroy();
        });
        return scope.$on('$stateChangeStart', function() {
          iscroll.destroy();
          element.removeAttr('bp-iscroll');
          return element.find('bp-iscroll-wrapper').css({
            position: 'static',
            transform: '',
            transition: ''
          });
        });
      }
    };
  }));

  angular.module('bp.directives').directive('bpNavbar', deps(['bpConfig', '$timeout', '$compile'], function(bpConfig, $timeout, $compile) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<div class="bp-navbar-text" role="heading"></div>',
      compile: function(elem, attrs, transcludeFn) {
        return function(scope, element, attrs) {
          var attr, key, options;
          options = angular.extend({
            noCenter: bpConfig.platform === 'android' ? true : false,
            noButtonSplit: bpConfig.platform === 'android' ? true : false
          }, bpConfig.navbar || {});
          for (key in options) {
            attr = attrs["bp" + (key.charAt(0).toUpperCase()) + (key.slice(1))];
            if (attr != null) {
              options[key] = (attr === '' ? true : attr);
            }
          }
          element.attr({
            role: 'navigation'
          });
          return transcludeFn(scope, function(clone) {
            var $button, $child, $navbarText, buttons, child, i, navbarText, placedButtons, _i, _j, _k, _len, _len1, _len2;
            $navbarText = element.find('.bp-navbar-text');
            placedButtons = 0;
            buttons = [];
            navbarText = $navbarText.text();
            for (_i = 0, _len = clone.length; _i < _len; _i++) {
              child = clone[_i];
              $child = angular.element(child);
              if ($child.is('bp-button') || $child.is('bp-icon')) {
                buttons.push($child);
              } else if ($child.context.nodeName === '#text' || $child.is('span.ng-scope')) {
                navbarText += ' ' + $child.text().trim();
              }
            }
            $compile($navbarText.text(navbarText.trim()))(scope);
            if (options.noButtonSplit) {
              for (_j = 0, _len1 = buttons.length; _j < _len1; _j++) {
                $button = buttons[_j];
                if ($button.hasClass('bp-button-back')) {
                  $button.insertBefore($navbarText).addClass('before');
                } else {
                  element.append($button.addClass('after'));
                }
              }
            } else {
              for (i = _k = 0, _len2 = buttons.length; _k < _len2; i = ++_k) {
                $button = buttons[i];
                if ((i + 1) <= Math.round(buttons.length / 2)) {
                  $button.addClass('before').insertBefore($navbarText);
                } else {
                  element.append($button.addClass('after'));
                }
              }
            }
            if (!options.noCenter && !/^\s*$/.test($navbarText.text())) {
              return $timeout(function() {
                var $spacer, afterWidth, beforeWidth, difference;
                beforeWidth = 0;
                afterWidth = 0;
                elem.find('.after').each(function() {
                  return afterWidth += $(this).outerWidth();
                });
                elem.find('.before').each(function() {
                  return beforeWidth += $(this).outerWidth();
                });
                difference = afterWidth - beforeWidth;
                $spacer = $("            <div style='              -webkit-box-flex:10;              max-width:" + (Math.abs(difference)) + "px            '>");
                if (difference > 0) {
                  return $spacer.insertBefore($navbarText);
                } else if (difference < 0) {
                  return $spacer.insertAfter($navbarText);
                }
              }, 0);
            }
          });
        };
      }
    };
  }));

  angular.module('bp.directives').directive('bpScroll', deps([], function() {
    return function(scope, element, attrs) {
      element.bind('touchstart', function() {});
      return scope.$on('$destroy', function() {
        return element.unbind('touchstart');
      });
    };
  }));

  angular.module('bp.directives').directive('bpSearch', deps(['$compile', '$timeout'], function($compile, $timeout) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var $cancel, $search, placeholder, preventDefault;
        $cancel = $compile('<bp-button bp-tap="cancel()" bp-no-scroll>Cancel</bp-button>')(scope);
        $search = element.find('input');
        element.attr('role', 'search').append($cancel.hide());
        placeholder = $search != null ? $search.attr('placeholder') : void 0;
        if ((placeholder == null) || /^\s*$/.test(placeholder)) {
          if ($search != null) {
            $search.attr('placeholder', 'Search');
          }
        }
        preventDefault = function(e) {
          return typeof e.preventDefault === "function" ? e.preventDefault() : void 0;
        };
        if ($search != null) {
          $search.bind('focus', function() {
            var cancelWidth, inputWidth, padding;
            padding = +(element.css('padding-right')).replace('px', '');
            cancelWidth = $cancel.outerWidth();
            inputWidth = element.width() - padding;
            if ($search != null) {
              $search.css('width', "" + (inputWidth - cancelWidth) + "px");
            }
            $cancel.show();
            $timeout(function() {
              element.addClass('focus');
              return scope.$emit('bpTextDidBeginEditing');
            }, 0);
            if (element.prev().length) {
              element.bind('touchmove', preventDefault);
              return $timeout(function() {
                return window.scrollTo(0, element.prev().outerHeight());
              }, 0);
            }
          });
        }
        scope.cancel = function() {
          if ($search != null ? $search.is(':focus') : void 0) {
            $search.blur();
            scope.$emit('bpTextDidEndEditing');
          }
          scope.searchTerm = '';
          if ($search != null) {
            $search.css('width', '');
          }
          element.removeClass('focus');
          return $timeout(function() {
            return $cancel.hide();
          }, 500);
        };
        if ($search != null) {
          $search.bind('blur', function(e) {
            if ((scope.searchTerm == null) || /^\s*$/.test(scope.searchTerm)) {
              scope.cancel();
            }
            return element.unbind('touchmove', preventDefault);
          });
        }
        $cancel.bind('touchstart', preventDefault);
        return scope.$on('$destroy', function() {
          if ($search != null) {
            $search.unbind('focus blur');
          }
          element.unbind('touchmove', preventDefault);
          return $cancel.unbind('touchstart', preventDefault);
        });
      }
    };
  }));

  angular.module('bp.directives').directive('bpTabbar', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.attr({
          role: 'tablist'
        });
      }
    };
  });

  angular.module('bp.directives').directive('bpTab', deps(['$state', '$timeout'], function($state, $timeout) {
    return {
      scope: true,
      restrict: 'E',
      transclude: true,
      template: '<bp-icon></bp-icon>',
      compile: function(elem, attrs, transcludeFn) {
        return function(scope, element, attrs) {
          var $icon;
          element.attr({
            role: 'tab'
          });
          scope.tabState = attrs.bpState || '';
          $icon = element.find('bp-icon');
          angular.forEach(element.attr('class').split(' '), function(value) {
            if (/^bp\-icon\-/.test(value)) {
              $icon.addClass(value);
              return element.removeClass(value);
            }
          });
          transcludeFn(scope, function(clone) {
            return element.append(clone);
          });
          scope.$on('$stateChangeSuccess', function() {
            if ($state.includes(scope.tabState)) {
              return element.addClass('bp-tab-active').attr({
                'aria-selected': 'true'
              });
            } else {
              return element.removeClass('bp-tab-active').attr({
                'aria-selected': 'false'
              });
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
        };
      }
    };
  }));

  angular.module('bp.directives').directive('bpTableHeader', function() {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        return element.attr({
          role: 'heading'
        });
      }
    };
  });

  angular.module('bp.directives').directive('bpTable', function() {
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

  angular.module('bp.directives').directive('bpTap', deps(['$parse', 'tapService'], function($parse, tapService) {
    return function(scope, element, attrs) {
      var _ref;
      (_ref = tapService.getInstance()).setup.apply(_ref, arguments);
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

  BpConfig = (function() {
    function BpConfig() {}

    BpConfig.prototype.defaultConfig = {
      platform: 'ios'
    };

    BpConfig.prototype.userConfig = {
      noUserConfig: true
    };

    BpConfig.prototype.$get = function() {
      return angular.extend(this.defaultConfig, this.userConfig);
    };

    BpConfig.prototype.setConfig = function(config) {
      return this.userConfig = config;
    };

    return BpConfig;

  })();

  angular.module('bp.factories').provider('bpConfig', BpConfig);

  angular.module('bp.services').service('tapService', deps(['bpConfig'], function(bpConfig) {
    var TapService;
    TapService = (function() {
      function TapService() {}

      TapService.prototype.setup = function(scope, element, attrs, customOptions) {
        var options, touch,
          _this = this;
        options = this._getOptions.apply(this, arguments);
        touch = {};
        this.getTouch = function() {
          return touch;
        };
        this.setTouch = function(newTouch) {
          return touch = newTouch;
        };
        if ((!options.allowClick) && 'ontouchstart' in window) {
          element.bind('click', this.onClick);
        }
        scope.$on('$destroy', function() {
          return _this.onDestroy(element);
        });
        element.bind('touchstart', function(e) {
          return _this.onTouchstart(e, scope, element, touch, options);
        });
        element.bind('touchmove', function(e) {
          return _this.onTouchmove(e, scope, element, touch, options);
        });
        return element.bind('touchend', function(e) {
          return _this.onTouchend(e, scope, element, touch, options);
        });
      };

      TapService.prototype.onClick = function(e) {
        if (typeof e.preventDefault === "function") {
          e.preventDefault();
        }
        if (typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
        return typeof e.stopImmediatePropagation === "function" ? e.stopImmediatePropagation() : void 0;
      };

      TapService.prototype.onDestroy = function(element) {
        return element.unbind('touchstart touchmove touchend touchcancel click');
      };

      TapService.prototype.onTouchstart = function(e, scope, element, touch, options) {
        touch.x = this._getCoordinate(e, true);
        touch.y = this._getCoordinate(e, false);
        touch.ongoing = true;
        if ($(e.target).attr('bp-tap') && element[0] !== e.target) {
          return touch.nestedTap = true;
        } else {
          return element.addClass(options.activeClass);
        }
      };

      TapService.prototype.onTouchmove = function(e, scope, element, touch, options) {
        var x, y;
        x = this._getCoordinate(e, true);
        y = this._getCoordinate(e, false);
        if (options.boundMargin && (Math.abs(touch.y - y) < options.boundMargin && Math.abs(touch.x - x) < options.boundMargin)) {
          if (!touch.nestedTap) {
            element.addClass(options.activeClass);
          }
          touch.ongoing = true;
          if (options.noScroll) {
            return e.preventDefault();
          }
        } else {
          touch.ongoing = false;
          return element.removeClass(options.activeClass);
        }
      };

      TapService.prototype.onTouchend = function(e, scope, element, touch, options) {
        if (touch.ongoing && !touch.nestedTap && e.type === 'touchend') {
          element.trigger('tap', touch);
        }
        touch = {};
        return element.removeClass(options.activeClass);
      };

      TapService.prototype._getOptions = function(scope, element, attrs, customOptions) {
        var attr, key, options;
        options = {
          activeClass: 'bp-active',
          allowClick: false,
          boundMargin: 50,
          noScroll: false
        };
        options = angular.extend(options, bpConfig.tap || {});
        if ((element.is('bp-button') && element.parent('bp-navbar')) || element.is('bp-detail-disclosure')) {
          element.attr('bp-no-scroll', '');
          options.noScroll = true;
        }
        if (element.parents('[bp-iscroll]').length) {
          element.attr('bp-bound-margin', '5');
          options.boundMargin = 5;
        }
        angular.extend(options, customOptions || {});
        for (key in options) {
          attr = attrs["bp" + (key.charAt(0).toUpperCase()) + (key.slice(1))];
          if (attr != null) {
            options[key] = attr === '' ? true : attr;
          }
        }
        return options;
      };

      TapService.prototype._getCoordinate = function(e, isX) {
        var axis, _ref;
        axis = isX ? 'pageX' : 'pageY';
        e = e.originalEvent;
        if (e[axis]) {
          return e[axis];
        } else if (((_ref = e.changedTouches) != null ? _ref[0] : void 0) != null) {
          return e.changedTouches[0][axis];
        } else {
          return 0;
        }
      };

      return TapService;

    })();
    return {
      getInstance: function() {
        return new TapService;
      }
    };
  }));

  angular.module('bp.services').service('bpViewService', deps(['$rootScope', '$state'], function($rootScope, $state) {
    var direction, lastTransition, type,
      _this = this;
    direction = 'normal';
    type = '';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (!(toState.transition || fromState.transition)) {
        return direction = type = '';
      }
      direction = toParams.direction ? toParams.direction : _this.getDirection(fromState, toState);
      return type = toParams.transition ? toParams.transition : fromState.name === '' ? '' : direction === 'reverse' ? fromState.transition : toState.transition;
    });
    lastTransition = '';
    $rootScope.$on('$viewContentLoaded', function() {
      var transition;
      if (type && direction) {
        transition = "" + type + "-" + direction;
        angular.element('[ui-view]').each(function(i, view) {
          return angular.element(view).removeClass(lastTransition).addClass(transition);
        });
        return lastTransition = transition;
      }
    });
    this.getDirection = function(from, to) {
      var dir, fromSegments, index, segment, toSegments, _i, _len, _ref;
      dir = 'normal';
      if (!to && angular.isObject(from) && from.to) {
        _ref = from, to = _ref.to, from = _ref.from;
      }
      if (!from) {
        from = $state.current.url;
      }
      if (from === '^') {
        return '';
      }
      fromSegments = this._getURISegments(from);
      toSegments = this._getURISegments(to);
      if (toSegments.length < fromSegments.length) {
        dir = 'reverse';
        for (index = _i = 0, _len = toSegments.length; _i < _len; index = ++_i) {
          segment = toSegments[index];
          if (segment !== fromSegments[index]) {
            dir = 'normal';
            break;
          }
        }
        dir;
      } else if (toSegments.length === fromSegments.length) {
        dir = '';
      }
      return dir;
    };
    this._getURISegments = function(urlOrState) {
      var url, _ref;
      url = angular.isString(urlOrState) ? urlOrState.charAt(0) === '/' ? urlOrState : (_ref = $state.get(urlOrState)) != null ? _ref.url : void 0 : angular.isObject(urlOrState) ? urlOrState.url != null ? urlOrState.url : urlOrState.name != null ? $state.href(urlOrState.name) : void 0 : void 0;
      url = url.replace(/\/$/, '');
      return url.split('/');
    };
    $rootScope.to = function(state, stateParams) {
      if (stateParams == null) {
        stateParams = {};
      }
      return $state.transitionTo(state, stateParams);
    };
    return this;
  }));

}).call(this);

//# sourceMappingURL=../dist/bradypodion.js.map
