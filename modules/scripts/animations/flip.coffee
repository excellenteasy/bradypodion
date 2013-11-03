# # Flip

flip = (dir = 'normal', name = 'flip', duration = 500) ->
  sign = if dir is 'normal' then '' else '-'

  angular.module('bp.animations').animation "#{name}-#{dir}-enter", deps [
    '$timeout'
    ], (
    $timeout
    ) ->
    setup: (element) ->
      view    = element.parent('[ui-view]')
        .addClass('flip-normal-view')
        .css
          transition: "all #{duration/2000}s ease-in"
          transform:  'translate3d(0,0,0) rotateY(0deg)'
      wrapper = view.parent().addClass 'flip-normal-wrapper'
      { view, wrapper }

    start: (element, done, elements) ->
      width = elements.view.outerWidth()
      elements.view.css
        transform: "translate3d(0,0,-#{width}px) rotateY(#{sign}90deg)"
      $timeout ->
        elements.view.css
          transition: "all #{duration/2000}s ease-out"
          transform:  "translate3d(0,0,0) rotateY(#{sign}180deg)"

      , duration/2
      $timeout ->
        elements.view
          .removeClass('flip-normal-view')
          .css
            transition: ''
            transform: ''
        elements.wrapper.removeClass 'flip-normal-wrapper'
        done()
      , duration

  angular.module('bp.animations').animation "#{name}-#{dir}-leave", deps [
    '$timeout'
    ], (
    $timeout
    ) ->
    start: (e, done) ->
      $timeout done, duration

flip()
flip 'reverse'
