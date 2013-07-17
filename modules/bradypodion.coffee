'use strict'
###!
 * Bradypodion – an AngularJS directive library written in CoffeeScript used to build maintainable mobile web apps that don't suck.
 * @link https://github.com/excellenteasy/bradypodion
 * @license none
###
angular.module 'bp.controllers', []
angular.module 'bp.directives', []
angular.module 'bp.factories', []
angular.module 'bp', ['bp.controllers', 'bp.directives', 'bp.factories']
