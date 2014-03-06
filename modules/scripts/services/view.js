/**
@ngdoc service
@name bp.bpView
@description Service providing some helpers for views and states. Mainly used internally.
*/
angular.module('bp').service('bpView', function($rootScope, bpConfig) {
  function BpView() {
    this.onViewContentLoaded  = angular.bind(this, this.onViewContentLoaded)
    this.onStateChangeStart   = angular.bind(this, this.onStateChangeStart)
  }

  BpView.prototype.listen = function() {
    $rootScope.$on('$stateChangeStart', this.onStateChangeStart)
    $rootScope.$on('$viewContentLoaded', this.onViewContentLoaded)
  }

  BpView.prototype.onStateChangeStart = function(
    event,
    toState,
    toParams,
    fromState) {

    var direction = toParams.direction ||
      this.getDirection(fromState, toState)

    var type = toParams.transition ||
      this.getType(fromState, toState, direction)

    this.setTransition(type, direction)
  }

  BpView.prototype.onViewContentLoaded = function() {
    var $views = angular.element('[ui-view], ui-view')
    if (this.transition != null) {
      $views
        .removeClass(this.lastTransition)
        .addClass(this.transition)
      this.lastTransition = this.transition
    } else {
      $views.removeClass(this.lastTransition)
    }
  }

  /**
  @ngdoc function
  @name bp.bpView#setTransition
  @description
  @methodOf bp.bpView
  @param {string} type The transition type (cover|scale|slide)
  @param {string} direction The transition direction (normal|reverse)
  */
  BpView.prototype.setTransition = function(type, direction) {
    if (type != null && direction != null) {
      this.transition = type + '-' + direction
    } else {
      this.transition = null
    }
  }

  /**
  @ngdoc function
  @name bp.bpView#getDirection
  @description Determines the direction between two states based on URL conventions.
  @methodOf bp.bpView
  @param {string} from A state object
  @param {string} to A state object
  @returns {string | null} direction The transition direction (normal|reverse)
  */
  BpView.prototype.getDirection = function(from, to) {
    if (from.url === '^') {
      return null
    }

    if (angular.isObject(to.data) && to.data.up === from.name) {
      return 'normal'
    }

    if (angular.isObject(from.data) && from.data.up === to.name) {
      return 'reverse'
    }

    var fromSegs = this._getURLSegments(from)
    var toSegs   = this._getURLSegments(to)
    var fromLen  = fromSegs.length
    var toLen    = toSegs.length
    var diff     = toLen - fromLen

    if (diff > 0 && angular.equals(fromSegs, toSegs.slice(0,toLen - diff))) {
      return 'normal'
    } else if (diff < 0 &&
      angular.equals(toSegs, fromSegs.slice(0, fromLen  + diff))) {

      return 'reverse'
    }
    return null
  }

  /**
  @ngdoc function
  @name bp.bpView#getType
  @description Determines the type of a transition.
  @methodOf bp.bpView
  @param {string} from A state object
  @param {string} to A state object
  @param {string} direction The transition direction (normal|reverse)
  @returns {string} type The transition type (cover|scale|slide)
  */
  BpView.prototype.getType = function(from, to, direction) {
    var typeFromState = function(state) {
      var data = state.data
      var hasData = angular.isObject(data)

      if (hasData && angular.isString(data.transition)) {
        return data.transition
      } else if (hasData && data.modal) {
        return 'cover'
      } else {
        return bpConfig.platform === 'ios' ? 'slide' : 'scale'
      }
    }

    if (direction === 'reverse') {
      return typeFromState(from)
    } else {
      return typeFromState(to)
    }
  }

  BpView.prototype._getURLSegments = function(state) {
    return (state.url || '')
      .replace(/\/$/, '')
      .split('/')
  }

  return new BpView()
})
