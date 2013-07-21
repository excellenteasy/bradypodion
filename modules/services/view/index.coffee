# View Service

angular.module('bp.services').service 'bpViewService', deps [
  '$rootScope'
  '$state'
  ], (
  $rootScope
  $state
  ) ->
  transition = ''
  direction  = 'normal'

  @to = (state, back) ->
    direction = if back then 'reverse' else 'normal'
    $state.transitionTo state

  @setTransition  = (newTransition) ->
    transition = newTransition

  @getDirection = ->
    direction

  @getFullTransition = ->
    "#{transition}-#{direction}"

  $rootScope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) =>
    $rootScope.setTransition if fromState.name is ''
      ''
    else if $rootScope.getDirection() is 'reverse'
      fromState.transition
    else
      toState.transition

  angular.extend $rootScope, this
