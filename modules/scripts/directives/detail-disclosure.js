angular.module('bp').directive('bpDetailDisclosure', deps(['bpConfig', '$rootScope'], function(bpConfig, $rootScope) {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var $parent, uniqueId;
      if (bpConfig.platform === 'android') {
        return element.attr('aria-hidden', 'true');
      } else {
        $parent = element.parent();
        if (!(uniqueId = $parent.attr('id'))) {
          if ($rootScope._uniqueId == null) {
            $rootScope._uniqueId = 0;
          }
          uniqueId = 'bp_' + $rootScope._uniqueId++;
          $parent.attr('id', uniqueId);
        }
        return element.attr({
          'aria-describedby': uniqueId,
          'aria-label': 'More Info',
          role: 'button'
        });
      }
    }
  };
}));
