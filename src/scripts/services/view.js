/**
@ngdoc service
@name bp.util.bpView
@description Service providing some helpers for views and states. Mainly used internally.
*/
angular.module('bp.util').service('bpView', function($parse, bpApp) {

  /**
  @ngdoc function
  @name bp.util.bpView#getDirection
  @description Determines the direction between two states based on URL conventions.
  @methodOf bp.util.bpView
  @param {string} from A state object
  @param {string} to A state object
  @returns {string | null} direction The transition direction (normal|reverse)
  */
  this.getDirection = function(from, to) {
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
    var diff     = toSegs.length - fromSegs.length

    if (diff > 0 && fromSegs.join('') === toSegs.slice(0, -diff).join('')) {
      return 'normal'
    } else if (diff < 0 && toSegs.join('') === fromSegs.slice(0, diff).join('')) {
      return 'reverse'
    }

    return null
  }

  /**
  @ngdoc function
  @name bp.util.bpView#getType
  @description Determines the type of a transition.
  @methodOf bp.util.bpView
  @param {string} from A state object
  @param {string} to A state object
  @param {string} direction The transition direction (normal|reverse)
  @returns {string} type The transition type (cover|scale|slide)
  */
  this.getType = function(from, to, direction) {
    var typeFromState = function(state) {
      var data = state.data
      var hasData = angular.isObject(data)

      if (hasData && angular.isString(data.transition)) {
        return data.transition
      } else if (hasData && data.modal) {
        return 'cover'
      }

      return bpApp.platform === 'ios' ? 'slide' : 'scale'
    }

    if (direction === 'reverse') {
      return typeFromState(from)
    }

    return typeFromState(to)
  }

  /**
  @ngdoc function
  @name bp.util.bpView#parseState
  @description
  ```javascript
  bpView.parse('customer({id: id})', scope)
  // {state: 'customer', params: {id: 5}}
  ```
  @methodOf bp.util.bpView
  @param {string} ref The state reference with optional parameters.
  @param {scope} scope The scope the params should be parsed against.
  @returns {object} Contains parsed `state` and `params`.
  */
  this.parseState = function(ref, scope) {
    var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/)
    return {
      state: parsed[1],
      params: parsed[3] ? $parse(parsed[3])(scope) : null
    }
  }

  this._getURLSegments = function(state) {
    return (state.url || '')
      .replace(/\/$/, '')
      .split('/')
  }

  return this
})
