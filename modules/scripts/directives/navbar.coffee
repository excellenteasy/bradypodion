# # Navbar

angular.module('bp.directives').directive 'bpNavbar', deps [
  'bpConfig'
  '$timeout'
  '$compile'
  ], (
  bpConfig
  $timeout
  $compile
  ) ->
  restrict: 'E'
  transclude: true
  template: '<div class="bp-navbar-text" role="heading"></div>'
  compile: (elem, attrs, transcludeFn) ->
    (scope, element, attrs) ->

      options = angular.extend
        noCenter:      if bpConfig.platform is 'android' then yes else no
        noButtonSplit: if bpConfig.platform is 'android' then yes else no
      , bpConfig.navbar or {}

      for key of options
        attr = attrs["bp#{key.charAt(0).toUpperCase()}#{key.slice(1)}"]
        if attr? then options[key] = (if attr is '' then true else attr)

      element.attr
        role: 'navigation'
      transcludeFn scope, (clone) ->
        $navbarText = element.find('.bp-navbar-text')
        placedButtons = 0
        buttons = []

        navbarText = $navbarText.text()
        for child in clone
          $child = angular.element(child)
          if $child.is('bp-button') or $child.is('bp-icon')
            buttons.push($child)
          else if $child.context.nodeName is '#text' or
                  $child.is('span.ng-scope')
            navbarText += ' ' + $child.text().trim()

        # Trim leading and trailing whitespace
        $compile($navbarText.text navbarText.trim()) scope

        if options.noButtonSplit
          for $button in buttons
            if $button.hasClass 'bp-button-back'
              $button
                .insertBefore($navbarText)
                .addClass 'before'
            else
              element.append $button.addClass('after')
        else
          for $button, i in buttons
            if (i+1) <= Math.round(buttons.length/2)
              $button
                .addClass('before')
                .insertBefore $navbarText
            else
              element.append $button.addClass('after')

        if not options.noCenter and
           not /^\s*$/.test $navbarText.text() then $timeout ->
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
            $spacer.insertBefore $navbarText
          else if difference < 0
            $spacer.insertAfter $navbarText
        , 0
