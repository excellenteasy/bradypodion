# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->

  # Initial Transition Values
  direction = 'normal'
  type = ''

  # Detect transition type and direction before states change
  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>

    unless toState.transition or fromState.transition
      return direction = type = ''

    direction = if toParams.direction
      # This is only the case if the user writes the parameter manually
      toParams.direction
    else
      @getDirection fromState, toState

    type = if toParams.transition
      # This is only the case if the user writes the parameter manually
      toParams.transition
    else if fromState.name is ''
      ''
    else if direction is 'reverse'
      fromState.transition
    else
      toState.transition

  # Store last transition so we can clean up before doing the next one
  lastTransition = ''

  # Apply transition to view as class when loaded
  $rootScope.$on '$viewContentLoaded', ->
    if type and direction
      transition = "#{type}-#{direction}"
      angular.element('[ui-view]').each (i, view) ->
        angular.element(view)
          .removeClass(lastTransition)
          .addClass transition
      lastTransition = transition

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'

    if not to and angular.isObject(from) and from.to
      {to, from} = from

    from =  $state.current.url unless from
    return '' if from is '^'

    fromSegments = @_getURISegments from
    toSegments = @_getURISegments to

    if toSegments.length < fromSegments.length
      dir = 'reverse'
      for segment, index in toSegments
        if segment isnt fromSegments[index]
          dir = 'normal'
          break
      dir
    else if toSegments.length is fromSegments.length
      dir = ''

    dir

  # returns array of url segments for url or state (name)
  @_getURISegments = (urlOrState) ->
    url =
      if angular.isString urlOrState
        if urlOrState.charAt(0) is '/'
          urlOrState
        else
          $state.get(urlOrState)?.url
      else if angular.isObject urlOrState
        if urlOrState.url?
          urlOrState.url
        else if urlOrState.name?
          $state.href urlOrState.name

    # remove trailing slashes
    url = url.replace /\/$/, ''

    url.split('/')

  this
