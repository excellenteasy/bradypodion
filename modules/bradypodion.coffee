'use strict'
###!
 * Bradypodion – an AngularJS directive library written in CoffeeScript used to build maintainable mobile web apps that don't suck.
 * @link https://github.com/excellenteasy/bradypodion
 * @license none
###
directives = angular.module 'bp.directives', []
bp = angular.module 'bp', ['bp.directives']
