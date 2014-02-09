# # Config
class BpConfig
  defaultConfig:
    platform: 'ios'

  userConfig:
    noUserConfig: yes

  $get: -> angular.extend @defaultConfig, @userConfig

  setConfig: (config) -> @userConfig = config

angular.module('bp').provider 'bpConfig', BpConfig
