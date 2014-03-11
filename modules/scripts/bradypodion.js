/**
@ngdoc overview
@name bp.util
@description
# The `bp.util` sub-module

This module is a dependency of other modules. Do not include this module as a dependency
in your angular app (use {@link bp} module instead).
*/
angular.module('bp.util', []);

/**
@ngdoc overview
@name bp
@description
# The `bp` module
All Bradypodion services and directives are exposed on the `bp` module.
It requires `ngAnimate` and `ui.router`. Use it with your app likes this:
<pre>
angular.module('yourApp', ['bp'])
</pre>
*/
angular.module('bp', ['bp.util', 'ngAnimate', 'ui.router'])
