/*!
 * Bradypodion v0.5.0
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Released under the MIT license.
 *
 * Date: 2014-03-15T10:10:53
 */
(function () {
  'use strict';
  angular.module('bp.iscroll', ['bp']);
  angular.module('bp.iscroll').directive('bpIscroll', [
    'bpApp',
    'bpIscroll',
    '$timeout',
    function (bpApp, bpIscroll, $timeout) {
      return {
        transclude: true,
        template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
        controller: [
          '$scope',
          function ($scope) {
            var iscroll, iscrollsticky;
            $scope.getIScroll = function () {
              return iscroll;
            };
            $scope.getIScrollSticky = function () {
              return iscrollsticky;
            };
            this.setIScroll = function (inIscroll, inSticky) {
              iscroll = inIscroll;
              iscrollsticky = inSticky;
            };
          }
        ],
        link: function (scope, element, attrs, ctrl) {
          $timeout(function () {
            var iscs;
            var isc = new IScroll(element.get(0), bpIscroll);
            if (angular.isDefined(attrs.bpIscrollSticky) && bpApp.platform !== 'android') {
              var selector = attrs.bpIscrollSticky || 'bp-table-header';
              iscs = new IScrollSticky(isc, selector);
            }
            ctrl.setIScroll(isc, iscs);
          }, 0, false);
          element.on('$destroy', function () {
            scope.getIScroll().destroy();
          });
        }
      };
    }
  ]);
  angular.module('bp.iscroll').provider('bpIscroll', function () {
    var config = {
        probeType: 3,
        scrollbars: true
      };
    this.setConfig = function (inConfig) {
      config = angular.extend(config, inConfig);
    };
    this.$get = function () {
      return config;
    };
  });
}.call(this));