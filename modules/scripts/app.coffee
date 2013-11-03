'use strict'

angular.module('bradypodionApp', ['bp']).config((bpConfigProvider) ->
  bpConfigProvider.setConfig platform: localStorage.getItem('platform') or 'ios7'
).directive 'switchTheme', ->
  (scope, element, attrs) ->
    platforms = ['ios', 'ios7', 'android']
    scope.toggleTheme = (e) ->
      index = platforms.indexOf(scope.config.platform)
      scope.config.platform = platforms[++index % 3]
      localStorage.setItem 'platform', scope.config.platform
      location.reload()
