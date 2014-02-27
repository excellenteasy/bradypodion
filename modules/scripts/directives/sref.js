angular.module('bp').directive('bpSref', function($state, $parse, BpTap) {
  return {
    controller: function($scope) {
      // https://github.com/angular-ui/ui-router/blob/master/src/stateDirectives.js#L1-L5
      this.parseStateRef = function(ref) {
        var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/)
        return {
          state: parsed[1],
          params: parsed[3] ? $parse(parsed[3])($scope) : null
        }
      }
    },
    link: function(scope, element, attrs, ctrl) {
      var ref = ctrl.parseStateRef(attrs.bpSref)
      new BpTap(scope, element, attrs)
      element.bind('tap', function() {
        $state.go(ref.state,ref.params)
        return false
      })
      scope.$on('$destroy', function() {
        element.unbind('tap')
      })
    }
  }
})
