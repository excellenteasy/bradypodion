'use strict'

angular.module('bradypodionApp', ['bp','ui.state']).config((
  bpConfigProvider
  $urlRouterProvider
  $stateProvider
  ) ->

  bpConfigProvider.setConfig platform: localStorage.getItem('platform') or 'ios7'

  $urlRouterProvider.otherwise '/'

  $stateProvider
    .state('app',
      url: '/'
      templateUrl: 'views/index.html'
      transition: 'fade'
    )
    .state('animations',
      url: '/animations'
      templateUrl: 'views/animations/index.html'
      transition: 'slide'
    )
    .state('cover',
      url: '/animations/cover'
      templateUrl: 'views/animations/transition.html'
      transition: 'cover'
    )
    .state('fade',
      url: '/animations/fade'
      templateUrl: 'views/animations/transition.html'
      transition: 'fade'
    )
    .state('flip',
      url: '/animations/flip'
      templateUrl: 'views/animations/transition.html'
      transition: 'flip'
    )
    .state('scale',
      url: '/animations/scale'
      templateUrl: 'views/animations/transition.html'
      transition: 'scale'
    )
    .state('slide',
      url: '/animations/slide'
      templateUrl: 'views/animations/transition.html'
      transition: 'slide'
    )
    .state('directives',
      url: '/directives'
      templateUrl: 'views/directives/index.html'
      transition: 'slide'
    )
    .state('button',
      url: '/directives/button'
      templateUrl: 'views/directives/button.html'
      transition: 'slide'
    )
    .state('cell',
      url: '/directives/cell'
      templateUrl: 'views/directives/cell.html'
      transition: 'slide'
    )
    .state('icon',
      url: '/directives/icon'
      templateUrl: 'views/directives/icon.html'
      transition: 'slide'
    )
    .state('iscroll',
      url: '/directives/iscroll'
      templateUrl: 'views/directives/iscroll.html'
      transition: 'slide'
    )
    .state('iscroll-sticky',
      url: '/directives/iscroll/sticky'
      templateUrl: 'views/directives/iscroll/sticky.html'
      transition: 'slide'
    )
    .state('navbar',
      url: '/directives/navbar'
      templateUrl: 'views/directives/navbar.html'
      transition: 'slide'
    )
    .state('search',
      url: '/directives/search'
      templateUrl: 'views/directives/search.html'
      transition: 'slide'
    )
    .state('table-header',
      url: '/directives/table-header'
      templateUrl: 'views/directives/table-header.html'
      transition: 'slide'
    )
    .state('table',
      url: '/directives/table'
      templateUrl: 'views/directives/table.html'
      transition: 'slide'
    )
    .state('table-grouped',
      url: '/directives/table/grouped'
      templateUrl: 'views/directives/table/grouped.html'
      transition: 'slide'
    )
    .state('table-plain',
      url: '/directives/table/plain'
      templateUrl: 'views/directives/table/plain.html'
      transition: 'slide'
    )
    .state('table-section',
      url: '/directives/table/section'
      templateUrl: 'views/directives/table/section.html'
      transition: 'slide'
    )
    .state('tap',
      url: '/directives/tap'
      templateUrl: 'views/directives/tap.html'
      transition: 'slide'
    )
).directive('switchTheme', ->
  (scope, element, attrs) ->
    platforms = ['ios', 'ios7', 'android']
    scope.toggleTheme = (e) ->
      index = platforms.indexOf(scope.config.platform)
      scope.config.platform = platforms[++index % 3]
      localStorage.setItem 'platform', scope.config.platform
      location.reload()
).directive('demoTapped', (bpConfig) ->
  (scope, element, attrs) ->
    scope.tapped = ->
      scope.random = Math.floor(Math.random() * 100)
).controller('DemoDataCtrl', ($scope) ->
  $scope.cells = []
  for i in [0...300]
    $scope.cells.push i*Math.random()

    $scope.friends = [
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
)
