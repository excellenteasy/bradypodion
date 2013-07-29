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

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    dir = 'normal'
    from = '/' if from is '^'
    {to, from} = from if angular.isObject from

    if from
      fromURL = if from.charAt(0) is '/' then from else $state.href from
    else
      fromURL = $state.current.url
    toURL = if to.charAt(0) is '/' then to else $state.href to

    fromURL = fromURL.split '/'
    toURL = toURL.split '/'
    if toURL.length is fromURL.length-1 and
        fromURL.slice(0,fromURL.length-1).join('') is toURL.join('')
      dir = 'reverse'
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
