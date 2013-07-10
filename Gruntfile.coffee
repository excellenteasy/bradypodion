'use strict'

# Constants
MODULES_DIR      = 'modules'
BUILD_DIR        = 'build'
DIST_DIR         = 'dist'
VENDOR_FILES     = 'lib/*/index.js'

module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        cleanup: yes
        copy: no

    clean:
      build: [BUILD_DIR]
      dist: [DIST_DIR]
      tmp: 'tmp'

    coffee:
      dist:
        options:
          sourceMap: yes
          join: yes
        src: [
          "#{MODULES_DIR}/bradypodion.coffee"
          "#{MODULES_DIR}/*/*/*.coffee"
        ]
        dest: "#{DIST_DIR}/bradypodion.js"
      tests:
        options: join: yes
        src: ["#{MODULES_DIR}/*/*/test/*.coffee"]
        dest: "#{BUILD_DIR}/tests.js"

    coffeelint:
      options:
        newlines_after_classes:
          level: 'error'
        no_empty_param_list:
          level: 'error'
        no_stand_alone_at:
          level: 'error'
      directives:
        files: src: ["#{MODULES_DIR}/*/*/*.coffee"]
        max_line_length:
          value: 79
          level: 'error'
      tests:
        files: src: ["#{MODULES_DIR}/*/*/test/*.coffee"]
      gruntfile:
        files: src: ['Gruntfile.coffee']

    concat:
      vendors:
        src: [VENDOR_FILES]
        dest: "#{BUILD_DIR}/vendor.js"

    karma:
      options:
        configFile: 'karma.conf.js'
      continuous:
        singleRun: true
        browsers: ['PhantomJS']
      unit:
        background: true
        browsers: ['Chrome']


    shell:
      options:
        stderr : true
        stdout : true
        failOnError : true
      docs:
        command: './node_modules/codo/bin/codo modules -o docs'
      semver:
        command: './node_modules/semver-sync/bin/semver-sync -v'
      hooks:
        command: 'cp -R ./hooks ./.git/'

    watch:
      lib:
        files: ['Gruntfile.coffee', "#{MODULES_DIR}/**"]
        tasks: ['build', 'karma:unit:run']

    # internal tasks don't use by hand
    less:
      web:     files: 'dist/bradypodion.css':         ['tmp/bradypodion.less']
      android: files: 'dist/bradypodion.android.css': ['tmp/bradypodion.less']
      ios:     files: 'dist/bradypodion.ios.css':     ['tmp/bradypodion.less']
      ios7:    files: 'dist/bradypodion.ios7.css':    ['tmp/bradypodion.less']

  grunt.registerTask 'cssbuild', ->
    # config
    template = 'modules/bradypodion.less'
    modules  = "#{MODULES_DIR}/directives/*/less/*.less"
    possiblePlatforms = ['android', 'ios','ios7']

    # logic
    platforms = []
    if @args.length then @args.forEach (arg) ->
      arg = arg.toLowerCase()
      index = possiblePlatforms.indexOf arg
      if index >= 0
        platforms.push arg
        possiblePlatforms.splice index, 1
    else
      platforms = possiblePlatforms

    fileContent = grunt.file.read template
    grunt.file.expand
      filter: (path) ->
        platforms.forEach (platform) ->
          p = path.split '/'
          p = p[p.length-1].split '.'
          p.pop()
          p = p.join '.'
          if p is platform or p is 'general'
            chunk = "@import '#{path}';"
            if platforms.length > 1 and p isnt 'general'
              chunk = ".#{platform} { #{chunk} }"
            fileContent += chunk
    , modules

    grunt.file.write 'tmp/bradypodion.less', fileContent
    lessTask =  if platforms is possiblePlatforms
      'less:web'
    else
      # TODO: handle custom builds like `cssbuild:ios:android`
      "less:#{platforms[0]}"

    grunt.task.run [
      lessTask
      'clean:tmp'
    ]

  # Load grunt-* plugins
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.registerTask 'css', [
    'cssbuild'
    'cssbuild:android'
    'cssbuild:ios'
    'cssbuild:ios7']

  grunt.registerTask 'build', [
    'clean:build'
    'concat'
    'coffee'
    'css'
  ]

  grunt.registerTask 'dist', [
    'clean:dist'
    'coffee:dist'
    'css']

  grunt.registerTask 'test',  ['bower:install', 'build', 'karma:continuous']
  grunt.registerTask 'default',   ['build']

  grunt.registerTask 'dev', [
    'bower:install'
    'shell:hooks'
    'build'
    'karma:unit'
    'watch'
  ]

  grunt.registerTask 'docs',      ['dist', 'shell:docs']
  grunt.registerTask 'precommit', ['shell:semver', 'coffeelint', 'dist']
