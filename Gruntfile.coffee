'use strict'

# Constants
MODULES_DIR      = 'modules'
BUILD_DIR        = 'build'
DIST_DIR         = 'dist'
VENDOR_FILES     = 'lib/*/index.js'
GRUNTFILE        = 'Gruntfile.coffee'
TMP_DIR          = 'tmp'
PLATFORMS        = ['android', 'ios','ios7']

module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        cleanup: yes
        copy: no

    clean:
      build: [BUILD_DIR]
      dist: [DIST_DIR]
      tmp: TMP_DIR

    coffee:
      dist:
        options:
          sourceMap: yes
          join: yes
        src: [
          "#{MODULES_DIR}/bradypodion.coffee"
          '<%= coffeelint.directives.files.src %>'
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
        files: src: "<%= coffee.tests.src %>"
      gruntfile:
        files: src: [GRUNTFILE]

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
        files: ['<%= coffeelint.gruntfile.files.src %>', "#{MODULES_DIR}/**"]
        tasks: ['build', 'karma:unit:run']

    # internal tasks don't use by hand
    less: all:
      dest: "#{DIST_DIR}/bradypodion.css"
      src: ['<%= clean.tmp %>/bradypodion.less']

  grunt.registerTask 'cssbuild', ->
    # config
    template = 'modules/bradypodion.less'
    modules  = "#{MODULES_DIR}/directives/*/less/*.less"

    # logic
    platforms = []
    if @args.length then @args.forEach (arg) ->
      arg = arg.toLowerCase()
      index = PLATFORMS.indexOf arg
      if index >= 0
        platforms.push arg
        PLATFORMS.splice index, 1
    else
      platforms = PLATFORMS

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
    lessTask =  if platforms is PLATFORMS
      'less:all'
    else
      # create less task configuration on runtime depending on platforms
      config = grunt.config.get 'less'
      config.custom =
        src: ["<%= clean.tmp %>/bradypodion.less"]
        dest: "#{DIST_DIR}/bradypodion.#{platforms[0]}.css"
      grunt.config.set 'less', config

      # TODO: handle custom builds like `cssbuild:ios:android`
      "less:custom"

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
    'karma:continuous'
    'watch'
  ]

  grunt.registerTask 'docs',      ['dist', 'shell:docs']
  grunt.registerTask 'precommit', ['shell:semver', 'coffeelint', 'dist']
