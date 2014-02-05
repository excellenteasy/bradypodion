'use strict'

angular.module('bradypodionApp', ['bp','ui.router']).config((
  bpConfigProvider
  $urlRouterProvider
  $stateProvider
  ) ->

  bpConfigProvider.setConfig platform: localStorage.getItem('platform') or 'ios'

  $urlRouterProvider.otherwise '/'

  $stateProvider
    .state('app',
      url: '/'
      templateUrl: 'views/index.html'
      transition: 'fade'
      data:
        title: 'BradyPodion'
    )
    .state('animations',
      url: '/animations'
      templateUrl: 'views/animations/index.html'
      transition: 'slide'
      data:
        up: 'app'
    )
    .state('cover',
      url: '/animations/cover'
      templateUrl: 'views/animations/transition.html'
      transition: 'cover'
      data:
        up: 'animations'
    )
    .state('fade',
      url: '/animations/fade'
      templateUrl: 'views/animations/transition.html'
      transition: 'fade'
      data:
        up: 'animations'
    )
    .state('flip',
      url: '/animations/flip'
      templateUrl: 'views/animations/transition.html'
      transition: 'flip'
      data:
        up: 'animations'
    )
    .state('scale',
      url: '/animations/scale'
      templateUrl: 'views/animations/transition.html'
      transition: 'scale'
      data:
        up: 'animations'
    )
    .state('slide',
      url: '/animations/slide'
      templateUrl: 'views/animations/transition.html'
      transition: 'slide'
      data:
        up: 'animations'
    )
    .state('directives',
      url: '/directives'
      templateUrl: 'views/directives/index.html'
      transition: 'slide'
      data:
        up: 'app'
    )
    .state('button',
      url: '/directives/button'
      templateUrl: 'views/directives/button.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('cell',
      url: '/directives/cell'
      templateUrl: 'views/directives/cell.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('detail-disclosure',
      url: '/directives/detail-disclosure'
      templateUrl: 'views/directives/detail-disclosure.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('detail-disclosure-site',
      url: '/directives/detail-disclosure/site'
      templateUrl: 'views/directives/detail-disclosure/site.html'
      transition: 'cover'
    )
    .state('detail-disclosure-detail',
      url: '/directives/detail-disclosure/detail'
      templateUrl: 'views/directives/detail-disclosure/detail.html'
      transition: 'slide'
      data:
        up: 'detail-disclosure'
    )
    .state('icon',
      url: '/directives/icon'
      templateUrl: 'views/directives/icon.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('iscroll',
      url: '/directives/iscroll'
      templateUrl: 'views/directives/iscroll.html'
      controller: 'DemoDataCtrl'
      transition: 'slide'
      data:
        up: 'directives'
        title: 'iScroll'
    )
    .state('iscroll-sticky',
      url: '/directives/iscroll/sticky'
      templateUrl: 'views/directives/iscroll/sticky.html'
      transition: 'slide'
      data:
        up: 'iscroll'
        title: 'iScroll-sticky'
    )
    .state('navbar',
      url: '/directives/navbar'
      templateUrl: 'views/directives/navbar.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('scroll',
      url: '/directives/scroll'
      templateUrl: 'views/directives/scroll.html'
      transition: 'slide'
      controller: 'DemoDataCtrl'
      data:
        up: 'directives'
    )
    .state('scroll-sticky',
      url: '/directives/scroll/sticky'
      templateUrl: 'views/directives/scroll/sticky.html'
      transition: 'slide'
      data:
        up: 'scroll'
    )
    .state('search',
      url: '/directives/search'
      templateUrl: 'views/directives/search.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('tabbar',
      url: '/directives/tabbar'
      templateUrl: 'views/directives/tabbar.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('first',
      parent: 'tabbar'
      url: '/directives/tabbar'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      transition: 'fade'
      data:
        up: 'directives'
    )
    .state('second'
      parent: 'tabbar',
      url: '/directives/tabbar/second'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      transition: 'fade'
    )
    .state('third',
      parent: 'tabbar'
      url: '/directives/tabbar/third'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      transition: 'fade'
    )
    .state('fourth'
      parent: 'tabbar',
      url: '/directives/tabbar/fourth'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      transition: 'fade'
    )
    .state('fifth',
      parent: 'tabbar'
      url: '/directives/tabbar/fifth'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      transition: 'fade'
    )
    .state('table-header',
      url: '/directives/table-header'
      templateUrl: 'views/directives/table-header.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('table',
      url: '/directives/table'
      templateUrl: 'views/directives/table.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
    .state('table-grouped',
      url: '/directives/table/grouped'
      templateUrl: 'views/directives/table/grouped.html'
      controller: 'DemoDataCtrl'
      transition: 'slide'
      data:
        up: 'table'
    )
    .state('table-plain',
      url: '/directives/table/plain'
      templateUrl: 'views/directives/table/plain.html'
      controller: 'DemoDataCtrl'
      transition: 'slide'
      data:
        up: 'table'
    )
    .state('table-section',
      url: '/directives/table/section'
      templateUrl: 'views/directives/table/section.html'
      controller: 'DemoDataCtrl'
      transition: 'slide'
      data:
        up: 'table'
    )
    .state('tap',
      url: '/directives/tap'
      templateUrl: 'views/directives/tap.html'
      transition: 'slide'
      data:
        up: 'directives'
    )
).factory('dummyFriends', ->
  [
    name: 'Sandy'
    phone: '555-1276'
  ,
    name: 'Kirsten'
    phone: '800-BIG-MARY'
  ,
    name: 'Jimmy'
    phone: '555-4321'
  ,
    name: 'Julie'
    phone: '555-5678'
  ,
    name: 'Hailey'
    phone: '555-8765'
  ]
).directive('switchTheme', (bpConfig) ->
  (scope, element, attrs) ->
    platforms = ['ios', 'android']
    scope.toggleTheme = (e) ->
      index = platforms.indexOf(bpConfig.platform)
      bpConfig.platform = platforms[++index % 2]
      localStorage.setItem 'platform', bpConfig.platform
      location.reload()
).directive('demoTapped', (bpConfig) ->
  (scope, element, attrs) ->
    scope.tapped = ->
      scope.random = Math.floor(Math.random() * 100)
).controller('DemoDataCtrl', ($scope, dummyFriends) ->
  $scope.friends = dummyFriends;
  $scope.cells = []
  for i in [0...300]
    $scope.cells.push i*Math.random()
).controller('DemoTabbarCtrl', ($state, $scope, dummyFriends) ->
  $scope.state = $state.current.name
  $scope.friends = dummyFriends.sort ->
    0.5 - Math.random()
)
