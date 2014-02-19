var deps;
angular.module('bp', ['ngAnimate', 'ui.router']);

deps = function(deps, fn) {
  deps.push(fn);
  return deps;
};
