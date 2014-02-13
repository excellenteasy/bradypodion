# # iScroll

angular.module('bp').directive 'bpIscroll', deps [
  'bpConfig'
  '$timeout'
  ], (
  bpConfig
  $timeout
  ) ->
  transclude: yes
  template: '<bp-iscroll-wrapper ng-transclude></bp-iscroll-wrapper>'
  controller: ($scope) ->
    iscroll = null
    iscrollsticky = null

    $scope.getIScroll = -> iscroll
    $scope.getIScrollSticky = -> iscrollsticky

    $scope.setIScroll = (inIscroll, inSticky) ->
      iscroll = inIscroll
      iscrollsticky = inSticky

  link: (scope, element, attrs) ->
    # TODO: pass in options on a per directive basis
    options = angular.extend
      probeType: 3
      scrollbars: yes
    , bpConfig.iscroll

    $timeout ->
      isc = new IScroll element.get(0), options

      if attrs.bpIscrollSticky? and bpConfig.platform isnt 'android'
        selector = attrs.bpIscrollSticky or 'bp-table-header'
        iscs = new IScrollSticky isc, selector

      scope.setIScroll isc, iscs
    , 0

    element.on '$destroy', ->
      scope.getIScroll().destroy()
