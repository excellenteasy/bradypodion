'use strict'
###!
 * Bradypodion - build maintainable mobile web apps that don't suck.
 * @link https://github.com/excellenteasy/bradypodion
 * @license none
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
  angular.module (namespaced = "bp.#{module}"), inject
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps
