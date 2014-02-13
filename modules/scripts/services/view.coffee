# View Service

angular.module('bp').service 'bpView', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->
  class BpView
    constructor: ->
      @transition = null
      @lastTransition = null

    listen: ->
      # Detect transition type and direction before states change
      $rootScope.$on '$stateChangeStart', @onStateChangeStart

      # Apply transition to view as class when loaded
      $rootScope.$on '$viewContentLoaded', @onViewContentLoaded

    onStateChangeStart: (event, toState, toParams, fromState, fromParams) =>
      direction = toParams.direction or @getDirection fromState, toState
      type = toParams.transition or @getType fromState, toState, direction

      @setTransition type, direction

    onViewContentLoaded: =>
      $views = angular.element '[ui-view], ui-view'
      if @transition?
        $views
          .removeClass @lastTransition
          .addClass @transition
        @lastTransition = @transition
      else
        $views.removeClass @lastTransition

    setTransition: (type, direction) ->
      @transition = if type? and direction?
        "#{type}-#{direction}"
      else
        null

    getDirection: (from, to) ->
      direction = 'normal'

      return null if from.url is '^'

      fromSegments = @_getURLSegments from
      toSegments = @_getURLSegments to

      if toSegments.length < fromSegments.length
        direction = 'reverse'
        for segment, index in toSegments
          if segment isnt fromSegments[index]
            direction = 'normal'
            break
        direction
      else if toSegments.length is fromSegments.length
        direction = null

      direction

    getType: (from, to, direction) ->
      if direction is 'reverse'
        from.data?.transition or null
      else
        to.data?.transition or null

    _getURLSegments: (state) ->
      url = state.url or ''
      # remove trailing slashes
      url = url.replace /\/$/, ''
      url.split('/')

  new BpView
