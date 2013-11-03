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
).directive 'switchTheme', ->
  (scope, element, attrs) ->
    platforms = ['ios', 'ios7', 'android']
    scope.toggleTheme = (e) ->
      index = platforms.indexOf(scope.config.platform)
      scope.config.platform = platforms[++index % 3]
      localStorage.setItem 'platform', scope.config.platform
      location.reload()
