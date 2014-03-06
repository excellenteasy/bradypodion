/**
@ngdoc directive
@name bp.directive:bpApp
@requires bp.bpConfig
@requires bp.bpView
@restrict AE
@description
The bpApp directive is similiar to Angular's own ngApp directive.
It is used to initalize a Bradypodion application, as it applies important CSS information and sets up transitions.
In most cases you will be fine by putting it right next to the ngApp directive.
 */
angular.module('bp').directive('bpApp', function($compile, bpConfig, bpView) {
  return {
    restrict: 'AE',
    link: function(scope, element) {
      bpView.listen()
      element.addClass(bpConfig.platform).attr({
        role: 'application'
      })
    }
  }
})
