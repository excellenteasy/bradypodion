'use strict'

modules = [
  'animations'
  'directives'
  'factories'
  'services'
]

modules = for module in modules
  inject = []
  if module is 'animations'  then inject.push('ngAnimate')
  angular.module (namespaced = "bp.#{module}"), inject
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps
