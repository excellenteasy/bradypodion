angular.module('bp').service('bpSref', function($parse) {
  this.parse = function(ref, scope) {
    var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/)
    return {
      state: parsed[1],
      params: parsed[3] ? $parse(parsed[3])(scope) : null
    }
  }
  return this
})
