/*!
 * Bradypodion v0.5.0-beta.1
 * http://bradypodion.io/
 *
 * Copyright 2013, 2014 excellenteasy GbR, Stephan Bönnemann und David Pfahler
 * Released under the MIT license.
 *
 * Date: 2014-02-25T12:08:54
 */
(function () {
  'use strict';
  angular.module('bp').directive('bpIscroll', [
    'bpConfig',
    '$timeout',
    function (bpConfig, $timeout) {
      return {
        transclude: true,
        template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>',
        controller: [
          '$scope',
          function ($scope) {
            var iscroll, iscrollsticky;
            iscroll = null;
            iscrollsticky = null;
            $scope.getIScroll = function () {
              return iscroll;
            };
            $scope.getIScrollSticky = function () {
              return iscrollsticky;
            };
            $scope.setIScroll = function (inIscroll, inSticky) {
              iscroll = inIscroll;
              iscrollsticky = inSticky;
            };
          }
        ],
        link: function (scope, element, attrs) {
          var options;
          options = angular.extend({
            probeType: 3,
            scrollbars: true
          }, bpConfig.iscroll);
          $timeout(function () {
            var iscs;
            var isc = new IScroll(element.get(0), options);
            if (attrs.bpIscrollSticky != null && bpConfig.platform !== 'android') {
              var selector = attrs.bpIscrollSticky || 'bp-table-header';
              iscs = new IScrollSticky(isc, selector);
            }
            scope.setIScroll(isc, iscs);
          }, 0);
          element.on('$destroy', function () {
            scope.getIScroll().destroy();
          });
        }
      };
    }
  ]);
}.call(this));