# # Config
angular.module('bp').provider 'bpConfig', do -> class BpConfig

  config =
    platform: 'ios'

  constructor: ->
    # Bp is configurable on runtime, but
    # this could cause an inconsistent app state.
    # You should know what you're doing.
    config.setConfig = @setConfig

  $get: ->
    config

  setConfig: (inConfig) ->
    config = angular.extend config, inConfig
