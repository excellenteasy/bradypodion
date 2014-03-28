/**
@ngdoc directive
@restrict E
@name bp.directive:bpSearch
@example
<pre>
<bp-search>
  <input ng-model="mymodel">
</bp-search>
</pre>
@description A search box that recreates native behavior on both ios and android.
You have to create an `<input>` field within the directive yourself, so you can control the associated model.
*/

angular.module('bp').directive('bpSearch', function(
  $compile,
  $timeout,
  $window,
  bpApp) {

  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var ios = bpApp.platform === 'ios'
      var childScope = scope.$new(true)

      var $bgLeft, $bgRight, $cancel
      if (ios) {
        $bgLeft = angular.element('<bp-search-bg-left>')
        $bgRight = angular.element('<bp-search-bg-right>')
        $cancel = $compile(angular.element('<bp-action>')
          .addClass('bp-button')
          .attr('ng-click', 'onCancel()')
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

      var $tapLayer = $compile(angular.element('<bp-search-tap>')
        .attr('ng-click', 'onFocus()'))(childScope)

      var $search = element.find('input')

      $search.attr({
        required: 'required',
        type: $search.attr('type') || 'search'
      })

      childScope.placeholder = $search.attr('placeholder')
      if (childScope.placeholder == null) {
        childScope.placeholder = 'Search'
      }

      element
        .attr('role', attrs.role || 'search')
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
        }, 50, false)

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
        if (angular.isUndefined(extra)) {
          extra = {}
        }
        if (!ios) {
          element.removeClass('focus')
        } else if (!$search.val() && !extra.programatic) {
          childScope.onCancel()
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
      }

      $search.bind('blur', childScope.onBlur)
      $tapLayer.bind('click touchstart touchmove touchend', childScope.stopPropagation)

      scope.$on('$destroy', function() {
        childScope.$destroy()
        if (ios) {
          angular.element($window).unbind('resize orientationchange')
        }
        $tapLayer.unbind('click touchstart touchmove touchend')
        $search.unbind('blur')
      })
    }
  }
})
