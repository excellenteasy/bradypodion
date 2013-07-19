'use strict'
###!
 * Bradypodion – an AngularJS directive library written in CoffeeScript used to build maintainable mobile web apps that don't suck.
 * @link https://github.com/excellenteasy/bradypodion
 * @license none
###

modules = [
  'animations'
  'controllers'
  'directives'
  'factories'
]

modules = for module in modules
  angular.module (namespaced = "bp.#{module}"), []
  namespaced

angular.module 'bp', modules

deps = (deps, fn) ->
  deps.push fn
  deps
