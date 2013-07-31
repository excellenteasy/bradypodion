(function() {
  'use strict';
  /*!
   * Bradypodion – an AngularJS directive library written in CoffeeScript used to build maintainable mobile web apps that don't suck.
   * @link https://github.com/excellenteasy/bradypodion
   * @license none
  */

  var deps, flip, inject, module, modules, namespaced;

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

  flip = function(dir, name, duration) {
    var sign;
    if (dir == null) {
      dir = 'normal';
    }
    if (name == null) {
      name = 'flip';
    }
    if (duration == null) {
      duration = 500;
    }
    sign = dir === 'normal' ? '' : '-';
    angular.module('bp.animations').animation("" + name + "-" + dir + "-enter", deps(['$timeout'], function($timeout) {
      return {
        setup: function(element) {
          var view, wrapper;
          view = element.parent('[ui-view]').addClass('flip-normal-view').css({
            transition: "all " + (duration / 2000) + "s ease-in",
            transform: 'translate3d(0,0,0) rotateY(0deg)'
          });
          wrapper = view.parent().addClass('flip-normal-wrapper');
          return {
            view: view,
            wrapper: wrapper
          };
        },
        start: function(element, done, elements) {
          var width;
          width = elements.view.outerWidth();
          elements.view.css({
            transform: "translate3d(0,0,-" + width + "px) rotateY(" + sign + "90deg)"
          });
          $timeout(function() {
            return elements.view.css({
              transition: "all " + (duration / 2000) + "s ease-out",
              transform: "translate3d(0,0,0) rotateY(" + sign + "180deg)"
            });
          }, duration / 2);
          return $timeout(function() {
            elements.view.removeClass('flip-normal-view').css({
              transition: '',
              transform: ''
            });
            elements.wrapper.removeClass('flip-normal-wrapper');
            return done();
          }, duration);
        }
      };
    }));
    return angular.module('bp.animations').animation("" + name + "-" + dir + "-leave", deps(['$timeout'], function($timeout) {
      return {
        start: function(e, done) {
          return $timeout(done, duration);
        }
      };
    }));
  };

  flip();

  flip('reverse');

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
        return element.attr({
          role: 'button'
        });
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

  angular.module('bp.directives').directive('bpIscroll', deps(['bpConfig', '$timeout'], function(bpConfig, $timeout) {
    return {
      transclude: true,
      template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
      link: function(scope, element, attrs) {
        var instanciateIScroll, iscroll, options;
        iscroll = {};
        scope.getIScroll = function() {
          return iscroll;
        };
        options = angular.extend({
          delay: element.parents('[ng-animate]').length ? 500 : 0,
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
        scope.$on('$destroy', function() {
          return iscroll.destroy();
        });
        return scope.$on('$stateChangeStart', function() {
          element.removeAttr('bp-iscroll');
          element.find('bp-iscroll-wrapper').css({
            position: 'static',
            transform: '',
            transition: ''
          });
          return iscroll.destroy();
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
                  $button.insertBefore($navbarText);
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
              $search.css('width', "" + (inputWidth - cancelWidth - padding) + "px");
            }
            $cancel.show();
            $timeout(function() {
              return element.addClass('focus');
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
        return element.attr({
          role: 'list'
        });
      }
    };
  });

  angular.module('bp.directives').directive('bpTap', deps(['bpConfig', '$parse'], function(bpConfig, $parse) {
    return function(scope, element, attrs) {
      var attr, dir, key, options, toStateName, touch, _ref;
      options = angular.extend({
        noScroll: false,
        activeClass: 'bp-active',
        boundMargin: 50,
        allowClick: false
      }, bpConfig.tap || {});
      for (key in options) {
        attr = attrs["bp" + (key.charAt(0).toUpperCase()) + (key.slice(1))];
        if (attr != null) {
          options[key] = attr === '' ? true : attr;
        }
      }
      if (element.is('bp-button') && element.parent('bp-navbar')) {
        element.attr('bp-no-scroll', '');
        options.noScroll = true;
      }
      if (element.parents('[bp-iscroll]').length) {
        element.attr('bp-bound-margin', '5');
        options.boundMargin = 5;
      }
      if (element.is('bp-button')) {
        toStateName = (_ref = attrs.bpTap.match(/to\(('|")([A-Za-z]+)('|")/)) != null ? _ref[2] : void 0;
        if (toStateName && angular.isFunction(scope.getDirection)) {
          dir = scope.getDirection({
            to: toStateName
          });
          if (dir === 'reverse') {
            element.addClass('bp-button-back');
          }
        }
      }
      touch = {};
      element.bind('touchstart', function(e) {
        var _ref1, _ref2;
        touch.y = e.originalEvent.pageY ? e.originalEvent.pageY : ((_ref1 = e.originalEvent.changedTouches) != null ? _ref1[0] : void 0) != null ? e.originalEvent.changedTouches[0].pageY : 0;
        touch.x = e.originalEvent.pageX ? e.originalEvent.pageX : ((_ref2 = e.originalEvent.changedTouches) != null ? _ref2[0] : void 0) != null ? e.originalEvent.changedTouches[0].pageX : 0;
        touch.ongoing = true;
        return element.addClass(options.activeClass);
      });
      element.bind('touchmove', function(e) {
        var x, y, _ref1, _ref2;
        y = e.originalEvent.pageY ? e.originalEvent.pageY : ((_ref1 = e.originalEvent.changedTouches) != null ? _ref1[0] : void 0) != null ? e.originalEvent.changedTouches[0].pageY : 0;
        x = e.originalEvent.pageX ? e.originalEvent.pageX : ((_ref2 = e.originalEvent.changedTouches) != null ? _ref2[0] : void 0) != null ? e.originalEvent.changedTouches[0].pageX : 0;
        if (options.boundMargin && (Math.abs(touch.y - y) < options.boundMargin && Math.abs(touch.x - x) < options.boundMargin)) {
          element.addClass(options.activeClass);
          touch.ongoing = true;
          if (options.noScroll) {
            return e.preventDefault();
          }
        } else {
          touch.ongoing = false;
          return element.removeClass(options.activeClass);
        }
      });
      element.bind('touchend touchcancel', function(e) {
        if (touch.ongoing && e.type === 'touchend') {
          scope.$apply($parse(attrs.bpTap), {
            $event: e,
            touch: touch
          });
          element.trigger('tap', angular.extend({
            type: 'tap',
            touch: touch
          }, e));
        }
        touch = {};
        return element.removeClass(options.activeClass);
      });
      if ((!options.allowClick) && 'ontouchstart' in window) {
        element.bind('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return e.stopImmediatePropagation();
        });
      }
      return scope.$on('$destroy', function() {
        return element.unbind('touchstart touchmove touchend touchcancel click');
      });
    };
  }));

  angular.module('bp.factories').provider('bpConfig', function() {
    this.defaultConfig = {
      platform: 'ios'
    };
    this.userConfig = {
      noUserConfig: true
    };
    this.$get = function() {
      return angular.extend(this.defaultConfig, this.userConfig);
    };
    return this.setConfig = function(config) {
      return this.userConfig = config;
    };
  });

  angular.module('bp.services').service('bpViewService', deps(['$rootScope', '$state'], function($rootScope, $state) {
    var direction, transition,
      _this = this;
    direction = 'normal';
    transition = '';
    this.to = function(state, stateParams) {
      if (stateParams == null) {
        stateParams = {};
      }
      return $state.transitionTo(state, stateParams);
    };
    this._getURISegmentsFrom = function(urlOrState) {
      var url;
      url = angular.isString(urlOrState) ? urlOrState.charAt(0) === '/' ? urlOrState : $state.href(urlOrState) : angular.isObject(urlOrState && (urlOrState.url != null)) ? urlOrState.url : void 0;
      url = url.replace(/\/$/, '');
      return url.split('/');
    };
    this.getDirection = function(from, to) {
      var dir, fromURI, toURI, _ref;
      dir = 'normal';
      if (angular.isObject(from)) {
        _ref = from, to = _ref.to, from = _ref.from;
      }
      if (!from) {
        from = $state.current.url;
      }
      if (from === '^') {
        return 'none';
      }
      fromURI = this._getURISegmentsFrom(from);
      toURI = this._getURISegmentsFrom(to);
      if (toURI.length === fromURI.length - 1 && fromURI.slice(0, fromURI.length - 1).join('') === toURI.join('')) {
        dir = 'reverse';
      } else if (toURI.length === fromURI.length) {
        dir = 'none';
      }
      return dir;
    };
    this.getFullTransition = function() {
      return "" + transition + "-" + direction;
    };
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toParams.direction) {
        direction = toParams.direction;
      } else {
        direction = _this.getDirection(fromState.url, toState.url);
      }
      return transition = toParams.transition ? toParams.transition : fromState.name === '' ? '' : direction === 'reverse' ? fromState.transition : toState.transition;
    });
    return angular.extend($rootScope, this);
  }));

}).call(this);

/*
//@ sourceMappingURL=bradypodion.js.map
*/