# # Navbar

navbar = ->
  restrict: 'E'
  transclude: true
  template: '<div class="bp-navbar-text"></div>'
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->
      transcludeFn scope, (clone) ->
        $text = element.find('.bp-navbar-text')
        placedButtons = 0
        buttons = []

        for child in clone
          $child = angular.element(child)
          if $child.is('bp-button') or $child.is('bp-icon')
            buttons.push($child)
          else if $child.context.nodeName is '#text' or
                  $child.is('span.ng-scope')
            $text.text($text.text() + $child.text())

        for $button, i in buttons
          if (i+1) <= Math.round(buttons.length/2)
            $button
              .addClass('before')
              .insertBefore $text
          else
            element.append $button.addClass('after')

        unless /^\s*$/.test $text.text() then setTimeout ->
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
