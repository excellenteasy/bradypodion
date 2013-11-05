# Karma configuration

module.exports = (config) ->
  config.set

    # base path, that will be used to resolve all patterns, eg. files, exclude
    basePath: ''

    # frameworks to use
    frameworks: ['jasmine']

    # list of files / patterns to load in the browser
    files: [
      'modules/bower_components/lodash/index.js'
      'modules/bower_components/jquery/index.js'
      'modules/bower_components/iscroll/index.js'
      'modules/bower_components/iscroll-sticky/index.js'
      'modules/bower_components/angular/index.js'
      'modules/bower_components/angular-ui-router/index.js'
      'dist/bradypodion.js'
      'modules/bower_components/angular-mocks/index.js'
      'test/spec/*/*.coffee'
    ]

    # test results reporter to use
    # possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage']
    preprocessors:
      'dist/bradypodion.js': ['coverage']
      'test/spec/*/*.coffee': ['coffee']

    coverageReporter:
      type : 'lcov'
      dir : 'test/coverage/'

    # web server port
    port: 9876
    # cli runner port
    runnerPort: 9100

    # enable / disable colors in the output (reporters and logs)
    colors: on

    # level of logging
    # possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO

    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: on

    # Start these browsers, currently available:
    # - Chrome
    # - ChromeCanary
    # - Firefox
    # - Opera (has to be installed with `npm install karma-opera-launcher`)
    # - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    # - PhantomJS
    # - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome']

    # If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000

    # Continuous Integration mode
    # if true, it capture browsers, run tests and exit
    singleRun: false
