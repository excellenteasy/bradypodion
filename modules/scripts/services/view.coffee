# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->
  direction = 'normal'
  transition = ''

  @to = (state, stateParams = {}) ->
    $state.transitionTo state, stateParams

  # returns array of url segments for url or state (name)
  @_getURISegmentsFrom = (urlOrState) ->
    url =
      if angular.isString urlOrState
        if urlOrState.charAt(0) is '/'
          urlOrState
        else
          $state.getOptionsOfState(urlOrState)?.url
      else if angular.isObject urlOrState
        if urlOrState.url?
          urlOrState.url
        else if urlOrState.name?
          $state.href urlOrState.name

    # remove trailing slashes
    url = url.replace /\/$/, ''

    url.split('/')

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'


    if not to and angular.isObject(from) and from.to
      {to, from} = from

    from =  $state.current.url unless from
    return 'none' if from is '^'

    fromURI = @_getURISegmentsFrom from
    toURI = @_getURISegmentsFrom to

    if toURI.length < fromURI.length
      dir = 'reverse'
      for segment, index in toURI
        if segment isnt fromURI[index]
          dir = 'normal'
          break
      dir
    else if toURI.length is fromURI.length
      dir = 'none'
    dir

  @getFullTransition = -> "#{transition}-#{direction}"

  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>

    unless toState.transition and fromState.transition
      return ''

    if toParams.direction
      {direction} = toParams
    else
      direction = @getDirection fromState, toState

    transition =
      if toParams.transition
        toParams.transition
      else if fromState.name is ''
        ''
      else if direction is 'reverse'
        fromState.transition
      else
        toState.transition

  angular.extend $rootScope, this
