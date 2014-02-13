'use strict'

angular.module 'bp', ['ngAnimate', 'ui.router']

deps = (deps, fn) ->
  deps.push fn
  deps
