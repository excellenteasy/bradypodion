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
      data:
        transition: 'fade'
        title: 'BradyPodion'
    )
    .state('animations',
      url: '/animations'
      templateUrl: 'views/animations/index.html'
      data:
        transition: 'slide'
        up: 'app'
    )
    .state('cover',
      url: '/animations/cover'
      templateUrl: 'views/animations/transition.html'
      data:
        transition: 'cover'
        up: 'animations'
    )
    .state('fade',
      url: '/animations/fade'
      templateUrl: 'views/animations/transition.html'
      data:
        transition: 'fade'
        up: 'animations'
    )
    .state('flip',
      url: '/animations/flip'
      templateUrl: 'views/animations/transition.html'
      data:
        transition: 'flip'
        up: 'animations'
    )
    .state('scale',
      url: '/animations/scale'
      templateUrl: 'views/animations/transition.html'
      data:
        transition: 'scale'
        up: 'animations'
    )
    .state('slide',
      url: '/animations/slide'
      templateUrl: 'views/animations/transition.html'
      data:
        transition: 'slide'
        up: 'animations'
    )
    .state('directives',
      url: '/directives'
      templateUrl: 'views/directives/index.html'
      data:
        transition: 'slide'
        up: 'app'
    )
    .state('button',
      url: '/directives/button'
      templateUrl: 'views/directives/button.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('cell',
      url: '/directives/cell'
      templateUrl: 'views/directives/cell.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('detail-disclosure',
      url: '/directives/detail-disclosure'
      templateUrl: 'views/directives/detail-disclosure.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('detail-disclosure-site',
      url: '/directives/detail-disclosure/site'
      templateUrl: 'views/directives/detail-disclosure/site.html'
      data:
        transition: 'cover'
    )
    .state('detail-disclosure-detail',
      url: '/directives/detail-disclosure/detail'
      templateUrl: 'views/directives/detail-disclosure/detail.html'
      data:
        transition: 'slide'
        up: 'detail-disclosure'
    )
    .state('icon',
      url: '/directives/icon'
      templateUrl: 'views/directives/icon.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('iscroll',
      url: '/directives/iscroll'
      templateUrl: 'views/directives/iscroll.html'
      controller: 'DemoDataCtrl'
      data:
        transition: 'slide'
        up: 'directives'
        title: 'iScroll'
    )
    .state('iscroll-sticky',
      url: '/directives/iscroll/sticky'
      templateUrl: 'views/directives/iscroll/sticky.html'
      data:
        transition: 'slide'
        up: 'iscroll'
        title: 'iScroll-sticky'
    )
    .state('navbar',
      url: '/directives/navbar'
      templateUrl: 'views/directives/navbar.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('scroll',
      url: '/directives/scroll'
      templateUrl: 'views/directives/scroll.html'
      controller: 'DemoDataCtrl'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('scroll-sticky',
      url: '/directives/scroll/sticky'
      templateUrl: 'views/directives/scroll/sticky.html'
      data:
        transition: 'slide'
        up: 'scroll'
    )
    .state('search',
      url: '/directives/search'
      templateUrl: 'views/directives/search.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('tabbar',
      url: '/directives/tabbar'
      templateUrl: 'views/directives/tabbar.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('first',
      parent: 'tabbar'
      url: '/directives/tabbar'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      data:
        transition: 'fade'
    )
    .state('second'
      parent: 'tabbar',
      url: '/directives/tabbar/second'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      data:
        transition: 'fade'
    )
    .state('third',
      parent: 'tabbar'
      url: '/directives/tabbar/third'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      data:
        transition: 'fade'
    )
    .state('fourth'
      parent: 'tabbar',
      url: '/directives/tabbar/fourth'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      data:
        transition: 'fade'
    )
    .state('fifth',
      parent: 'tabbar'
      url: '/directives/tabbar/fifth'
      templateUrl: 'views/directives/tabbar/screen.html'
      controller: 'DemoTabbarCtrl'
      data:
        transition: 'fade'
    )
    .state('table-header',
      url: '/directives/table-header'
      templateUrl: 'views/directives/table-header.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('table',
      url: '/directives/table'
      templateUrl: 'views/directives/table.html'
      data:
        transition: 'slide'
        up: 'directives'
    )
    .state('table-grouped',
      url: '/directives/table/grouped'
      templateUrl: 'views/directives/table/grouped.html'
      controller: 'DemoDataCtrl'
      data:
        transition: 'slide'
        up: 'table'
    )
    .state('table-plain',
      url: '/directives/table/plain'
      templateUrl: 'views/directives/table/plain.html'
      controller: 'DemoDataCtrl'
      data:
        transition: 'slide'
        up: 'table'
    )
    .state('table-section',
      url: '/directives/table/section'
      templateUrl: 'views/directives/table/section.html'
      controller: 'DemoDataCtrl'
      data:
        transition: 'slide'
        up: 'table'
    )
    .state('tap',
      url: '/directives/tap'
      templateUrl: 'views/directives/tap.html'
      data:
        transition: 'slide'
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
