/**
@ngdoc service
@name bp.bpSref
@description Services that parses state references.
Used internally by {@link bp.directive:bpSref} and {@link bp.directive:bpNavbar}.
*/
angular.module('bp').service('bpSref', function($parse) {
  /**
  @ngdoc function
  @name bp.bpSref#parse
  @description
  ```javascript
  bpSref.parse('customer({id: id})', scope)
  // {state: 'customer', params: {id: 5}}
  ```
  @methodOf bp.bpSref
  @param {string} ref The state reference with optional parameters.
  @param {scope} scope The scope the params should be parsed against.
  @returns {object} Contains parsed `state` and `params`.
  */
  this.parse = function(ref, scope) {
    var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/)
    return {
      state: parsed[1],
      params: parsed[3] ? $parse(parsed[3])(scope) : null
    }
  }
  return this
})
