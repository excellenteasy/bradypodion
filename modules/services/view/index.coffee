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
          $state.href urlOrState
      else if angular.isObject urlOrState and urlOrState.url?
        urlOrState.url

    # remove trailing slashes
    url = url.replace /\/$/, ''

    url.split('/')

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'
    {to, from} = from if angular.isObject from
    from =  $state.current.url unless from

    return 'none' if from is '^'

    fromURI = @_getURISegmentsFrom from
    toURI = @_getURISegmentsFrom to

    if toURI.length is fromURI.length-1 and
        fromURI.slice(0,fromURI.length-1).join('') is toURI.join('')
      dir = 'reverse'
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

    if toParams.direction
      {direction} = toParams
    else
      direction = @getDirection fromState.url, toState.url

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
