###
  bradypodion navbar directive
  @since 0.1.0
  @example description of navbar example
    <bp-navbar>Title</bp-navbar>
  @return [Object<restrict|template|link>] Angular directive
###
navbar = ->
  restrict: 'E'
  transclude: true
  template: '<div class="bp-navbar-text"></div>'
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        $text = element.find('.bp-navbar-text')
        placedButtons = 0

        angular.forEach clone, (value, key) ->
          $value = angular.element(value)
          if $value.is('bp-button') or $value.is('bp-icon')
            method = (if placedButtons % 2 then "append" else "prepend")
            elem[method] value
            if method is "append"
              $value.addClass('after')
            else
              $value.addClass('before')
            placedButtons++
          else if $value.context.nodeName is '#text' or
                  $value.is('span.ng-scope')
            $text.text($text.text() + $value.text())

        setTimeout ->
          beforeWidth = 0
          afterWidth  = 0
          elem.find('.after').each ->
            afterWidth += $(this).outerWidth()
          elem.find('.before').each ->
            beforeWidth += $(this).outerWidth()

          difference = afterWidth - beforeWidth
          $spacer = $("
            <div style='
              -webkit-box-flex:10;
              max-width:#{Math.abs(difference)}px
            '>")

          if difference > 0
            $spacer.insertBefore $text
          else if difference < 0
            $spacer.insertAfter $text
        , 0

angular.module('bp.directives').directive 'bpNavbar', navbar
