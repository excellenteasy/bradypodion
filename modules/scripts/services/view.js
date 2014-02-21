angular.module('bp').service('bpView', function($rootScope) {
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

  BpView.prototype.setTransition = function(type, direction) {
    if (type != null && direction != null) {
      this.transition = type + '-' + direction
    } else {
      this.transition = null
    }
  }

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

  BpView.prototype.getType = function(from, to, direction) {
    if (direction === 'reverse') {
      if (angular.isObject(from.data)) {
        return from.data.transition || null
      }
    } else {
      if (angular.isObject(to.data)) {
        return to.data.transition || null
      }
    }
    return null
  }

  BpView.prototype._getURLSegments = function(state) {
    return (state.url || '')
      .replace(/\/$/, '')
      .split('/')
  }

  return new BpView()
})
