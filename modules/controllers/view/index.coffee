# # ViewCtrl

angular.module('bp.controllers').controller 'bpViewCtrl', deps [
  '$scope'
  '$state'
  ], (
  $scope
  $state
  ) ->
  transition = ''
  direction  = 'normal'

  $scope.to = (state, back) ->
    direction = if back then 'reverse' else 'normal'
    $state.transitionTo state

  $scope.setTransition = (newTransition) ->
    transition = newTransition

  $scope.getDirection = ->
    direction

  $scope.getFullTransition = ->
    "#{transition}-#{direction}"

  $scope.$on '$stateChangeStart', (
    event
    toState
    toParams
    fromState
    fromParams
    ) ->

    event.currentScope.setTransition if fromState.name is ''
      ''
    else if $scope.getDirection() is 'reverse'
      fromState.transition
    else
      toState.transition
