angular.module('bp').directive('bpSearch', function(
  $compile,
  $timeout,
  $window,
  BpTap,
  bpConfig) {

  return {
    restrict: 'E',
    link: function(scope, element) {
      var ios = bpConfig.platform === 'ios'
      var childScope = scope.$new(true)

      var $bgLeft, $bgRight, $cancel
      if (ios) {
        $bgLeft = angular.element('<bp-search-bg-left>')
        $bgRight = angular.element('<bp-search-bg-right>')
        $cancel = $compile(angular.element('<bp-action>')
          .addClass('bp-button')
          .text('Cancel'))(childScope)
      }

      var $placeholder = $compile(angular.element('<bp-search-placeholder>')
        .append(
          angular.element('<bp-action>')
            .addClass('bp-icon bp-icon-search')
        )
        .append(
          angular.element('<span>')
            .attr('ng-bind', 'placeholder')
        )
      )(childScope)

      var $tapLayer = angular.element('<bp-search-tap>')
      var $search = element.find('input').attr({
        required: 'required',
        type: 'search'
      })

      childScope.placeholder = $search.attr('placeholder')
      if (childScope.placeholder == null) {
        childScope.placeholder = 'Search'
      }

      if (ios) {
        new BpTap(childScope, $cancel, {})
      }
      new BpTap(childScope, $tapLayer, {})

      element
        .attr('role', 'search')
        .prepend($bgLeft, $bgRight)
        .append($placeholder, $cancel, $tapLayer)

      if (ios) {
        var cancelWidth
        $timeout(function() {
          var width = element.outerWidth()
          cancelWidth = $cancel.outerWidth()
          var inputWidth = width - cancelWidth - 6
          var iconWidth = $placeholder.find('.bp-icon').outerWidth()

          $bgLeft.css('width', inputWidth)
          $bgRight.css('width', cancelWidth)
          $search.css({
            width: inputWidth,
            'padding-left': 1.5 * iconWidth
          })
        }, 50)

        childScope.onResize = function() {
          var inputWidth = element.outerWidth() - cancelWidth
          $bgLeft.css('width', inputWidth)
        }

        childScope.onCancel = function() {
          element.removeClass('focus')
          $search.val('').trigger('input').trigger('blur', {
            programatic: true
          })
        }
      }

      childScope.onBlur = function(e, extra) {
        if (extra == null) {
          extra = {}
        }
        if (!ios) {
          element.removeClass('focus')
        } else if (!$search.val() && !extra.programatic) {
          $cancel.trigger('tap')
        }
      }

      childScope.onFocus = function() {
        $search.focus()
        $timeout(function() {
          element.addClass('focus')
        }, 0)
      }

      childScope.stopPropagation = function(e) {
        e.stopPropagation()
        e.stopImmediatePropagation()
      }

      if (ios) {
        angular.element($window)
          .bind('resize orientationchange', childScope.onResize)
        $cancel.bind('tap', childScope.onCancel)
      }

      $search.bind('blur', childScope.onBlur)
      $tapLayer
        .bind('tap', childScope.onFocus)
        .bind('click touchstart touchmove touchend', childScope.stopPropagation)

      scope.$on('$destroy', function() {
        childScope.$destroy()
        if (ios) {
          angular.element($window).unbind('resize orientationchange')
          $cancel.unbind('tap')
        }
        $search.unbind('blur')
        $tapLayer.unbind('tap click touchstart touchmove touchend')
      })
    }
  }
})