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
