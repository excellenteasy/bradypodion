# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->
  @to = (state, stateParams = {}) ->
    $state.transitionTo state, stateParams

  @setTransition  = (newTransition) ->
    $state.params.transition = newTransition

  # Flexible API paramaters scope.getDirection parameters...
  # 1) fromURL, toURL
  # 2) fromStateName, toStateName
  # 3) options = {from, to}
  @getDirection = (from, to) ->
    if $state.params.direction
      return $state.params.direction
    $state.params.direction = 'normal'
    from = '/' if from is '^'
    {to, from} = from if angular.isObject from

    if from
      fromURL = if from.charAt(0) is '/' then from else $state.href from
    else
      fromURL = $state.current.url
    toURL = if to.charAt(0) is '/' then to else $state.href to

    fromURL = fromURL.split('/')
    toURL = toURL.split('/')
    if toURL.length is fromURL.length-1 and
        fromURL.slice(0,fromURL.length-1).join('') is toURL.join('')
      $state.params.direction = 'reverse'
    $state.params.direction

  @getFullTransition = ->
    "#{transition}-#{direction}"

  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>

    direction = @getDirection fromState.url, toState.url

    $rootScope.setTransition if fromState.name is ''
      ''
    else if direction is 'reverse'
      fromState.transition
    else
      toState.transition

  angular.extend $rootScope, this
