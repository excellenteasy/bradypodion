angular.module('bp').directive('uiSref', function($injector) {
  return {
    compile: function(e, attrs) {
      if (angular.isDefined(attrs.ngClick)) {
        return
      }
      return $injector.get('ngClickDirective')[0].compile.apply(this, arguments)
    }
  }
});
