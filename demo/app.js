(function() {
  'use strict';
  angular.module('bradypodionApp', ['bp']).config(function(bpConfigProvider, $urlRouterProvider, $stateProvider) {
    bpConfigProvider.setConfig({
      platform: localStorage.getItem('platform') || 'ios'
    });
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('app', {
      url: '/',
      templateUrl: 'table.html',
      data: {
        transition: 'fade',
        title: 'BradyPodion'
      }
    }).state('animations', {
      url: '/animations',
      templateUrl: 'animations/index.html',
      data: {
        up: 'app'
      }
    }).state('cover', {
      url: '/animations/cover',
      templateUrl: 'animations/transition.html',
      data: {
        transition: 'cover',
        up: 'animations'
      }
    }).state('fade', {
      url: '/animations/fade',
      templateUrl: 'animations/transition.html',
      data: {
        transition: 'fade',
        up: 'animations'
      }
    }).state('scale', {
      url: '/animations/scale',
      templateUrl: 'animations/transition.html',
      data: {
        transition: 'scale',
        up: 'animations'
      }
    }).state('slide', {
      url: '/animations/slide',
      templateUrl: 'animations/transition.html',
      data: {
        transition: 'slide',
        up: 'animations'
      }
    }).state('directives', {
      url: '/directives',
      templateUrl: 'directives/index.html',
      data: {
        up: 'app'
      }
    }).state('button', {
      url: '/directives/button',
      templateUrl: 'directives/button.html',
      data: {
        up: 'directives'
      }
    }).state('cell', {
      url: '/directives/cell',
      templateUrl: 'directives/cell.html',
      data: {
        up: 'directives'
      }
    }).state('detail-disclosure', {
      url: '/directives/detail-disclosure',
      templateUrl: 'directives/detail-disclosure.html',
      data: {
        up: 'directives'
      }
    }).state('detail-disclosure-site', {
      url: '/directives/detail-disclosure/site',
      templateUrl: 'directives/detail-disclosure/site.html',
      data: {
        modal: true
      }
    }).state('detail-disclosure-detail', {
      url: '/directives/detail-disclosure/detail',
      templateUrl: 'directives/detail-disclosure/detail.html',
      data: {
        up: 'detail-disclosure'
      }
    }).state('icon', {
      url: '/directives/icon',
      templateUrl: 'directives/icon.html',
      data: {
        up: 'directives'
      }
    }).state('iscroll', {
      url: '/directives/iscroll',
      templateUrl: 'directives/iscroll.html',
      controller: 'DemoDataCtrl',
      data: {
        up: 'directives',
        title: 'iScroll'
      }
    }).state('iscroll-sticky', {
      url: '/directives/iscroll/sticky',
      templateUrl: 'directives/iscroll/sticky.html',
      data: {
        up: 'iscroll',
        title: 'iScroll-sticky'
      }
    }).state('navbar', {
      url: '/directives/navbar',
      templateUrl: 'directives/navbar.html',
      data: {
        up: 'directives'
      }
    }).state('scroll', {
      url: '/directives/scroll',
      templateUrl: 'directives/scroll.html',
      controller: 'DemoDataCtrl',
      data: {
        up: 'directives'
      }
    }).state('scroll-sticky', {
      url: '/directives/scroll/sticky',
      templateUrl: 'directives/scroll/sticky.html',
      data: {
        up: 'scroll'
      }
    }).state('search', {
      url: '/directives/search',
      templateUrl: 'directives/search.html',
      data: {
        up: 'directives'
      }
    }).state('tabbar', {
      url: '/directives/tabbar',
      templateUrl: 'directives/tabbar.html',
      data: {
        up: 'directives'
      }
    }).state('first', {
      parent: 'tabbar',
      url: '/directives/tabbar',
      templateUrl: 'directives/tabbar/screen.html',
      controller: 'DemoTabbarCtrl',
      data: {
        transition: 'fade'
      }
    }).state('second', {
      parent: 'tabbar',
      url: '/directives/tabbar/second',
      templateUrl: 'directives/tabbar/screen.html',
      controller: 'DemoTabbarCtrl',
      data: {
        transition: 'fade'
      }
    }).state('third', {
      parent: 'tabbar',
      url: '/directives/tabbar/third',
      templateUrl: 'directives/tabbar/screen.html',
      controller: 'DemoTabbarCtrl',
      data: {
        transition: 'fade'
      }
    }).state('fourth', {
      parent: 'tabbar',
      url: '/directives/tabbar/fourth',
      templateUrl: 'directives/tabbar/screen.html',
      controller: 'DemoTabbarCtrl',
      data: {
        transition: 'fade'
      }
    }).state('fifth', {
      parent: 'tabbar',
      url: '/directives/tabbar/fifth',
      templateUrl: 'directives/tabbar/screen.html',
      controller: 'DemoTabbarCtrl',
      data: {
        transition: 'fade'
      }
    }).state('table-header', {
      url: '/directives/table-header',
      templateUrl: 'directives/table-header.html',
      data: {
        up: 'directives'
      }
    }).state('table', {
      url: '/directives/table',
      templateUrl: 'directives/table.html',
      data: {
        up: 'directives'
      }
    }).state('table-grouped', {
      url: '/directives/table/grouped',
      templateUrl: 'directives/table/grouped.html',
      controller: 'DemoDataCtrl',
      data: {
        up: 'table'
      }
    }).state('table-plain', {
      url: '/directives/table/plain',
      templateUrl: 'directives/table/plain.html',
      controller: 'DemoDataCtrl',
      data: {
        up: 'table'
      }
    }).state('table-section', {
      url: '/directives/table/section',
      templateUrl: 'directives/table/section.html',
      controller: 'DemoDataCtrl',
      data: {
        up: 'table'
      }
    }).state('tap', {
      url: '/directives/tap',
      templateUrl: 'directives/tap.html',
      data: {
        up: 'directives'
      }
    }).state('toolbar', {
      url: '/directives/toolbar',
      templateUrl: 'directives/toolbar.html',
      data: {
        up: 'directives'
      }
    });
  }).factory('dummyFriends', function() {
    return [
      {
        name: 'Sandy',
        phone: '555-1276'
      }, {
        name: 'Kirsten',
        phone: '800-BIG-MARY'
      }, {
        name: 'Jimmy',
        phone: '555-4321'
      }, {
        name: 'Julie',
        phone: '555-5678'
      }, {
        name: 'Hailey',
        phone: '555-8765'
      }
    ];
  }).directive('switchTheme', function(bpConfig) {
    return function(scope, element, attrs) {
      var platforms;
      platforms = ['ios', 'android'];
      element.addClass(bpConfig.platform === 'ios' ? 'fa-android' : 'fa-apple');
      scope.toggleTheme = function(e) {
        var index;
        index = platforms.indexOf(bpConfig.platform);
        bpConfig.platform = platforms[++index % 2];
        localStorage.setItem('platform', bpConfig.platform);
        location.reload();
      };
    };
  }).directive('demoTapped', function(bpConfig) {
    return function(scope, element, attrs) {
      scope.tapped = function() {
        scope.random = Math.floor(Math.random() * 100);
      };
    };
  }).controller('DemoDataCtrl', function($scope, dummyFriends) {
    var i, _i, _results;
    $scope.friends = dummyFriends;
    $scope.cells = [];
    _results = [];
    for (i = _i = 0; _i < 300; i = ++_i) {
      _results.push($scope.cells.push(i * Math.random()));
    }
    return _results;
  }).controller('DemoTabbarCtrl', function($state, $scope, dummyFriends) {
    $scope.state = $state.current.name;
    $scope.friends = dummyFriends.sort(function() {
      return 0.5 - Math.random();
    });
  });

}).call(this);
