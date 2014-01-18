'use strict'
###!
 * Bradypodion - Create post-platform mobile apps with ease.
 * Copyright 2013 - 2014: excellenteasy GbR, Stephan Bönnemann, David Pfahler
 * http://bradypodion.io/
 * BradyPodion is currently in private beta
###

modules = [
  'animations'
  'directives'
  'factories'
  'controllers'
  'services'
]

modules = for module in modules
  inject = []
  if module is 'controllers' then inject.push('bp.services')
  if module is 'animations'  then inject.push('ngAnimate')
  angular.module (namespaced = "bp.#{module}"), inject
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps
